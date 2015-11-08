/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var deviceOnline = false;
var deviceReady = false;

var app = {
    fragrance: null,
    imei: "IMEI_NOT_AVAILABLE",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('online', this.onOnline, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        window.plugins.orientationLock.lock("portrait");
        fragrance = FragrancePlugin;
        fragrance.getImei(function(data) {
            imei = data;
            ws_analytics.imei = imei;
            if( imei !== null )
                document.getElementById("uuid").innerHTML = "IMEI: " + imei;
            else
                document.getElementById("uuid").innerHTML = "UUID: " + device.uuid;
        },
        function() {
            console.log("error getting uuid");
        });
        // Alternative way to get uuid: device.uuid, but this is different from imei

        document.getElementById("sendPageChangeEvent").addEventListener("click", app.pushActivePage);
        document.getElementById("setQuestionnaireEvent").addEventListener("click", app.setQuestionnaire);
        document.getElementById("getLatestTags").addEventListener("click", app.getLatestTags);
        document.getElementById("getPageStatistics").addEventListener("click", app.getPageStatistics);
        nfc.addTagDiscoveredListener(app.onNfc, null, null);
        nfc.addTagDiscoveredListener(app.onNfc, null, null);
        nfc.enabled(function() {
            document.getElementById("nfcEnabled").innerHTML = "NFC device available!";
            document.getElementById("nfcEnabled").style.color ="Green";
        }, function() {
            document.getElementById("nfcEnabled").innerHTML = "NFC not available!";
            document.getElementById("nfcEnabled").style.color ="Red";
        });
        deviceReady = true;
        ws_analytics.initialize();


    },

    // online event handler
    onOnline: function() {
        app.receivedEvent('online');
        deviceOnline = true;
        ws_analytics.initialize();
        ws_analytics.push_active_page("index");
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    onNfc: function(nfcEvent) {
        console.log(JSON.stringify(nfcEvent.tag));
        var tag = nfcEvent.tag;
        document.getElementById("nfcTagNdef").innerHTML = "Tag ID: " + tag.id;

        //TODO: Send websocket message to cloud
        if( ws_analytics.ws.isConnected() ) {
            var msg = {"tagid": tag.id, "tagtypes":  tag.techtype};
            ws_analytics.register_tag(tag);
        }
    },

    pushActivePage: function() {
        //TODO: Send websocket message
        console.log("push_active_page event");
        ws_analytics.push_active_page("details");
    },

    setQuestionnaire: function() {
        console.log("setQuestionnaire");
        ws_analytics.set_questionnaire(true,null,null);
    },

    getLatestTags: function() {
        console.log("getLatestTags");
        ws_analytics.get_latest_tags(5, function(data) {
            if( data !== null ) {
                for( var i = 0; i < data.length; i++ ) {
                    console.log(i.toString() + ": Tag ID: " + data[i].tagid);
                }
            }
        });
    },

    getPageStatistics: function() {
        console.log("get_page_statistics");
        ws_analytics.get_page_statistics(function(data) {
            if( data !== null ) {
                for( var i = 0; i < data.length; i++ ) {
                    console.log(i.toString() + ": Page: " + data[i].page + ", time spent: " + data[i].time_spent + ", visit count: " + data[i].visit_count);
                }
            }
        });
    }
};

app.initialize();
### Intercom android module for Intercom Android SDK version 1.1.21

Integrate Intercom.io with Appcelerator.  iOS module available here https://github.com/markive/TiIntercom . Tested with 5.1.1GA SDK

### Example
```
var TiIntercom = require('intercom');
TiIntercom.initialize(<API KEY>,<APP ID>);
TiIntercom.startSession("jerodfritz@gmail.com");
```

### /lib/intercom.js
```
var TiIntercom = require('ti.intercom.android');

exports.initialize = function(key, id){
  TiIntercom.initialize({
      api_key : key,
      app_id : id,
  });
}

exports.startSession = function(email) {
  TiIntercom.reset();
  TiIntercom.registerUserWithEmail(email);
};

exports.endSession = function() {
  TiIntercom.reset();
};

exports.openIntercom = function() {
  TiIntercom.presentConversationList();
};

exports.logEventWithNameAndData = function(eventName, data /* 'event_name', { msg: 'hi' } */) {
  TiIntercom.logEventWithNameAndData(eventName, data);
};

exports.updateUserWithAttributes = function(data /* { fname: 'John', lname: 'Doe' } */) {
  TiIntercom.updateUserWithAttributes(data);
};

exports.setDeviceToken = function(token, appicon /* 'device-token', Ti.App.Android.R.drawable.appicon */) {
  TiIntercom.setDeviceToken(token, appicon);
};

```

### IMPORTANT : tiapp.xml changes for Android GCM support
```
    <android xmlns:android="http://schemas.android.com/apk/res/android">
        <manifest>
            <application>
                <service
                    android:name="io.intercom.android.sdk.gcm.GcmIntentService"
                    android:enabled="false" />

                <!-- GCM setup -->
                <receiver
                    android:name="io.intercom.android.sdk.gcm.GcmBroadcastReceiver"
                    android:enabled="false"
                    android:permission="com.google.android.c2dm.permission.SEND" >
                    <intent-filter>
                        <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                        <action android:name="com.google.android.c2dm.intent.REGISTRATION" />

                        <category android:name="io.intercom.intercomsdk.gcm" />
                    </intent-filter>
                </receiver>

                <meta-data
                    android:name="com.google.android.gms.version"
                    android:value="@integer/google_play_services_version" />

            </application>
        </manifest>    
    </android>
```

### IMPORTANT : create hooks folder and intercom.js file in the module for Android GCM support
You need to create a hooks folder with a .js file inside the module directory with the following contents.  This makes sure the additional R values are added for intercom during compile.  If someone can tell me how to update the ant build script to create this automatically in the compiled dist please let me know otherwise you need to do this manually after compile.

Create the following file:

FILE: /modules/android/ti.intercom.android/1.0.4/hooks/intercom.js
```
exports.cliVersion = '>=3.X';

exports.init = function(logger, config, cli, appc) {
  cli.on('build.android.aapt', {
    pre : function(data, next) {
      var args = data.args[1];
      if (args.indexOf('--auto-add-overlay') < 0) {
        args.push('--auto-add-overlay');
      }

      var externalLibraries = [{
        javaClass : 'io.intercom.android.sdk.gcm',
        resPath : '/Users/jerodfritz/Appcelerator/Prspctr/modules/android/ti.intercom.android/1.0.4/platform/android/gcm-res'
      }];
      console.log("Add Intercom GCM External Libraries", JSON.stringify(externalLibraries));

      // --extra-packages can be defined just once
      if (args.indexOf('--extra-packages') < 0) {
        args.push('--extra-packages');
        args.push('');
      }
      var namespaceIndex = args.indexOf('--extra-packages') + 1;

      externalLibraries.forEach(function(lib) {
        if (args[namespaceIndex].indexOf(lib.javaClass) < 0) {
          args[namespaceIndex].length && (args[namespaceIndex] += ':');
          args[namespaceIndex] += lib.javaClass;
        }
        if (args.indexOf(lib.resPath) < 0) {
          args.push('-S');
          args.push(lib.resPath);
        }
      });
      next(null, data);
    }
  });
};
```


#### Author
Jerod
(jerodfritz@gmail.com)


#### License

    The MIT License (MIT) Copyright © 2015

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

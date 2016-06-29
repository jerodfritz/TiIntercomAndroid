# tiintercomandroid Module

### add hooks folder to the module for Android GCM support
You need to create a hooks folder twith a single js file within the module directory.  This makes sure the additional R values are added for intercom during compile.  For example create the following file:

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


### tiapp.xml changes for Android GCM support
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

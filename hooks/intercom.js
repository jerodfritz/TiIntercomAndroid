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

(function(obj) {

	
		function loaded(evt) {
			console.log(fileApc.files[0]['name'] + ': loding complete!')
			// Obtain the read file data
		  var fileString = evt.target.result;

			// Utilty vars
			var fileRoot = fileApc.files[0]['name'].replace(/\.apc$/, '');
			var cfg = "";

			document.getElementById('fileApcContent').textContent = fileString;

			// Parse json and populate the fields
			var json=JSON.parse(fileString.replace("\n"," ") );
			console.log(json);

			document.getElementById('certCA').textContent = json['ca_cert'];
			document.getElementById('keyFile').textContent = json['key'];
			document.getElementById('certFile').textContent = json['certificate'];
			document.getElementById('authFile').textContent = json['username'] + '\n' + json['password'];

			cfg = cfg + `client
proto tcp-client
dev tun
`;

			cfg = cfg + 'ca ' + fileRoot + '-ca.crt\n';
			cfg = cfg + 'cert ' + fileRoot + '.crt\n';
			cfg = cfg + 'key ' + fileRoot + '.key\n';
			cfg = cfg + 'remote ' + json['server_address'][0] + ' ' + json['server_port'] +'\n';
			cfg = cfg + 'auth-user-pass ' + fileRoot + '.auth\n';
			cfg = cfg + 'auth ' + json['authentication_algorithm'] + '\n';
			cfg = cfg + 'cipher ' + json['encryption_algorithm'] + '\n';

			cfg = cfg + `user nobody
group nogroup
verb 2
mute 20
keepalive 10 120
comp-lzo
persist-key
persist-tun
float
resolv-retry infinite
nobind

comp-lzo no
route-delay 4
verb 3
reneg-sec 0
`;
			document.getElementById('cfgFile').textContent = cfg;

			// create the zip archive into a blob and enable the download button
			var zip = new JSZip();
			zip.file(fileRoot + '.conf', document.getElementById('cfgFile').textContent.replace(/\n/g, '\r\n'));
			zip.file(fileRoot + '-ca.crt', document.getElementById('certCA').textContent.replace(/\n/g, '\r\n'));
			zip.file(fileRoot + '.crt', document.getElementById('certFile').textContent.replace(/\n/g, '\r\n'));
			zip.file(fileRoot + '.auth', document.getElementById('authFile').textContent.replace(/\n/g, '\r\n'));
			zip.file(fileRoot + '.key', document.getElementById('keyFile').textContent.replace(/\n/g, '\r\n'));

			zip.generateAsync({type:"blob"})
				.then(function(content) {
					downloadButton.download = fileRoot + '.zip';
					downloadButton.href = URL.createObjectURL(content);
					console.log(content);
  		});


		} //function loaded


		var downloadButton = document.getElementById("download-button");
		var fileApc = document.getElementById("fileApc");
		var fileApcContent = document.getElementById("fileApcContent");

		// Load a file, trigger loaded as a callback
		fileApc.addEventListener('change', function() {
			console.log('Reading' + fileApc.files[0]['name'] );
			var reader = new FileReader();
			reader.readAsText(fileApc.files[0], "UTF-8");
			reader.onload = loaded;
		});




})(this);

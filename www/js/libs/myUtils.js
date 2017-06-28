/*
 * Singleton per funzioni di utilità generale
 *      [le funzioni necessitano di jquery]
 * */

var myUtils = {
    functionmodeimgcssmapping: {
        "0" : "offline",
        "1" : "caricoinverter",
        "2" : "batteria",
        "3" : "caricoinverter",
        "4" : "batteria",
        "5" : "caricobypass",
    },
    functionmodecssmapping: {
        "0" : "Offline",
        "1" : "Normal Mode",
        "2" : "Battery Load",
        "3" : "Stand-By",
        "4" : "Test Running",
        "5" : "By-pass Load",
    },
    nodestypemapping: {
        "1" : "RF-ANT",
        "2" : "RF-D110",
        "3" : "RF-LUX+",
        "4" : "RF-PWM",
        "5" : "RF-PWMSER",
        "6" : "RF-DALI",
        "7" : "RF-D00",
        "8" : "RF-PWM-N",
        "9" : "ZQ-RF",
        "10" : "ZQ-RF-LUX",
        "11" : "DALI-SENSE",
        "32" : "ZQ-SENSE"
    },
    switchImg: function(obj, down){
        var img = $('img',  $(obj)).attr('src');
        if(img == null || img == 'undefined')
            return;
        if(down)            img = img.replace("/p", "/pp");
        else                img = img.replace("/pp", "/p");
        $('img',  $(obj)).attr('src', img);
    },
    twodigit: function(digit){
        if(digit < 10)   return '0'+digit;
        return ''+digit;
    },
    log: function(msg, level){

        level = level || "log";

        if (typeof msg === "object") {

            msg = JSON.stringify(msg, null, "  ");
        }

        if(typeof(console)!='undefined')	console.log(msg);

        if (level === "status" || level === "error") {

            var msgDiv = document.createElement("div");
            msgDiv.textContent = msg;

            if (level === "error") {

                msgDiv.style.color = "red";
            }

            msgDiv.style.padding = "5px 0";
            msgDiv.style.borderBottom = "rgb(192,192,192) solid 1px";
            $('.advice').append(msgDiv);
            setTimeout(function(){
                $('.advice').empty();
            }, 3000)
        }
    },
    escapeUrlandTrim: function(value){
        value = $.trim(value);
        value = encodeURIComponent(value);
        value = value.replace (/\~/g, '%7E').replace (/\!/g, '%21').replace (/\(/g, '%28').replace (/\)/g, '%29').replace (/\'/g, '%27');
        value =value.replace (/%20/g, '+');

        return value;
    },
    isInt: function(n) {
        return typeof n === 'number' && n % 1 == 0;
    },
    roundNumber: function(rnum, rlength) { // Arguments: number to round, number of decimal places
        var newnumber = Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength);
        return parseFloat(newnumber); // Output the result to the form field (change for your purposes)
    },
    checkLength: function(element, maxLen){
        var str = $(element).html();
        if(str.length > maxLen){
            $(element).html(str.substr(0, maxLen - 3) + '...');
            $(element).attr('title', str);
        }
    },
    checkInputLength: function(element, maxLen){
        var str = $(element).val();
        if(str.length > maxLen){
            $(element).val(str.substr(0, maxLen - 3) + '...');
            $(element).attr('title', str);
        }
    },
    isValidDate: function(dateString)  // verifica formato dd/mm/yyyy
    {
        // First check for the pattern
        if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString))
            return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    },
    isValidTime: function(timeString){  // verifica formato HH:MM
        var timeFormat = /^([0-9]{2})\:([0-9]{2})$/g;
        return timeFormat.test(timeString);
    },
    convertUnitNotation: function(number){
        return String(number).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1.").split("").reverse().join("");
    },
    convertDateTime: function(datetime){
        var dt = datetime.split('T');
        var d = dt[0].split('-');
        return [d[2], d[1], d[0]].join('/')
    },
    addMinutes: function (time, minsToAdd) {
        function z(n){ return (n<10? '0':'') + n;};
        var bits = time.split(':');
        var mins = bits[0]*60 + +bits[1] + +minsToAdd;

        return z(mins%(24*60)/60 | 0) + ':' + z(mins%60) + ':00';
    },
    getNodeSignalPercentual: function(signallevel){
        var signalPerc = parseInt((signallevel / 180) * 100);
        if(signalPerc > 100)   signalPerc = 100;
        return signalPerc;
    },
    getNodeTypeString: function(type){

        if(this.nodestypemapping[type] != null)
            return this.nodestypemapping[type];

        if(type == 100)      { return "DRIVER-DALI"; }
        return "Unknown type: " + type;
    },
    getNodeIDString: function(nodeid){
        var hexNodeID = (parseInt(nodeid)).toString(16).toUpperCase();

        var str = '';
        for(var i = hexNodeID.length; i < 8; i++)   str = str + '0';
        hexNodeID = str + hexNodeID;
        str = '';
        for(i = 0; i < 8; i++){
            if( !(i%2) && i > 0 ) str = str + '-'+hexNodeID[i];
            else    str = str + hexNodeID[i];
        }
        return str;
    },
    isNodeSensorLux: function(type){
        return (parseInt(type) == 3     ||
                parseInt(type) == 10    ||
                parseInt(type) == 11    );
    },
   isNodeZQSense: function(type){
       return ( parseInt(type) == 32 );
   },
   getDaliAddressTypeString: function(nodeid){
        //this.log('getDaliAddressTypeString ' + nodeid)
        if(nodeid >= 0 && nodeid <= 63)
            return "Short Address";
        if(nodeid >= 64 && nodeid <= 80)
            return "Group Address";
        if(nodeid == 127)
            return "Broadcast Address";

        return "Undefined Type Address";
    },

    remove_duplicates: function (objectsArray) {
        var usedObjects = {};

        for (var i=objectsArray.length - 1;i>=0;i--) {
            var so = JSON.stringify(objectsArray[i]);

            if (usedObjects[so]) {
                objectsArray.splice(i, 1);

            } else {
                usedObjects[so] = true;
            }
        }

        return objectsArray;

    },

    modbusCRC16: function(byteArray){

        var crc16 = 65535;

        for(var i = 0; i < byteArray.length; i++){
            var tmp = byteArray[i];
            crc16 = myUtils.myXOR(crc16, tmp);      // crc16 XOR with temp
            for(var c = 0; c < 8; c++){
                var flag = crc16 & 1;               // LSBit di crc16 is mantained
                crc16 = crc16 >> 1;       		// Lsbit di crc16 is lost
                if (flag != 0){
                    crc16 = crc16 ^ 40961;  	// crc16 XOR with 0x0a001 [40961]
                }
            }
        }

    //    console.log(crc16);

        return [(crc16 & 255),  (crc16 >> 8)];          // LSB is exchanged with MSB
    },

    myXOR: function(a,b) {
       // return ( a || b ) && !( a && b );
        return ( a ^ b );
    },

    zqbox_wait_communication: function(box, clbEnd, clbError, retry){

      if(box == null){
          alert('Error: il ZQGate is not available!');
          return;
      }
      if(retry == null)   retry = 10;
      var self = this;
      box.waitNoSession(0, retry,
            function(){ clbEnd();  },
            function(){
                alert('Error:  RF-GATE is busy for comunication! Retry connect to RF-GATE');
                if(clbError)    clbError();
          });
    },

    convertGroupNumber: function(x){
        switch (x)
        {
           case 1:
            return 1;
           case 2:
            return 2;
           case 4:
            return 3;
           case 8:
            return 4;
           case 16:
            return 5;
           case 32:
            return 6;
           case 64:
            return 7;
           case 128:
            return 8;
           case 256:
            return 9;
           case 512:
            return 10;
           case 1024:
            return 11;
           case 2048:
            return 12;
           case 4096:
            return 13;
           case 8192:
            return 14;
           case 16384:
            return 15;
           case 32768:
            return 16;
        }
    }
};


/* Configurazione componenti select */
var selectConfigComponent = {

    selectLuxLevel : [
                {  value : 0, output: 'OFF' }, {  value : 5, output: '5%' }, {  value : 10, output: '10%' },
                {  value : 15, output: '15%' },{  value : 20, output: '20%' },{  value : 25, output: '25%' },
                {  value : 30, output: '30%' },{  value : 35, output: '35%' },{  value : 40, output: '40%' },
                {  value : 45, output: '45%' },{  value : 50, output: '50%' },{  value : 55, output: '55%' },
                {  value : 60, output: '60%' },{  value : 65, output: '65%' },{  value : 70, output: '70%' },
                {  value : 75, output: '75%' },{  value : 80, output: '80%' },{  value : 85, output: '85%' },
                {  value : 90, output: '90%' },{  value : 95, output: '95%' },{  value : 100, output: '100%' }
            ],

     selectGroupID : [
                            {  value : 1, output: 'Light Group 1' }, {  value : 2, output: 'Light Group 2' },
                            {  value : 4, output: 'Light Group 3' }, {  value : 8, output: 'Light Group 4' },
                            {  value : 16, output: 'Light Group 5' }, {  value : 32, output: 'Light Group 6' },
                            {  value : 64, output: 'Light Group 7' }, {  value : 128, output: 'Light Group 8' },
                            {  value : 256, output: 'Light Group 9' }, {  value : 512, output: 'Light Group 10' },
                            {  value : 1024, output: 'Light Group 11' }, {  value : 2048, output: 'Light Group 12' },
                            {  value : 4096, output: 'Light Group 13' }, {  value : 8192, output: 'Light Group 14' },
                            {  value : 16384, output: 'Light Group 15' }, {  value : 32768, output: 'Light Group 16' }
                        ],

     selectActionSimple : [ { value: -3, output: 'Light Level' },
                            { value : -2, output: 'Motion Detection' },
                            { value : -1, output: 'DLR Level' }
                          ],

     selectDaliActionSimple : [  { value: -3, output: 'Light Level' },
                                 { value : -4, output: 'Recall Scene' },
                                 { value : -2, output: 'Motion Detection' },
                                 { value : -1, output: 'DLR Level' },
                                 { value : -5, output: 'Motion&DLR Level' },
                                 { value : -6, output: 'ProcessExec' }
                                ],
     selectDaliScenes : [ {  value : 257, output: 'Scene 1' }, {  value : 258, output: 'Scene 2' },
                            {  value : 259, output: 'Scene 3' }, {  value : 260, output: 'Scene 4' },
                            {  value : 261, output: 'Scene 5' }, {  value : 262, output: 'Scene 6' },
                            {  value : 263, output: 'Scene 7' }, {  value : 264, output: 'Scene 8' },
                            {  value : 265, output: 'Scene 9' }, {  value : 266, output: 'Scene 10' },
                            {  value : 267, output: 'Scene 11' }, {  value : 268, output: 'Scene 12' },
                            {  value : 269, output: 'Scene 13' }, {  value : 270, output: 'Scene 14' },
                            {  value : 271, output: 'Scene 15' }, {  value : 272, output: 'Scene 16' }
                                ],

     selectAction : [
                {  value : 0, output: 'OFF' }, {  value : 5, output: 'MIN' }, {  value : 10, output: '10%' },
                {  value : 15, output: '15%' },{  value : 20, output: '20%' },{  value : 25, output: '25%' },
                {  value : 30, output: '30%' },{  value : 35, output: '35%' },{  value : 40, output: '40%' },
                {  value : 45, output: '45%' },{  value : 50, output: '50%' },{  value : 55, output: '55%' },
                {  value : 60, output: '60%' },{  value : 65, output: '65%' },{  value : 70, output: '70%' },
                {  value : 75, output: '75%' },{  value : 80, output: '80%' },{  value : 85, output: '85%' },
                {  value : 90, output: '90%' },{  value : 95, output: '95%' },{  value : 100, output: 'MAX' },
                {  value : -2, output: 'Motion Detection' },{  value : -1, output: 'DLR Level' }
            ],

     selectPriority : [
                {  value : 1, output: '1' }, {  value : 2, output: '2' }, {  value : 3, output: '3' },
                {  value : 4, output: '4' }, {  value : 5, output: '5' }, {  value : 6, output: '6' },
                {  value : 7, output: '7' }, {  value : 8, output: '8' }, {  value : 9, output: '9' },
                {  value : 10, output: '10' }
            ],

     selectDALIBroadcastAddress: [{ value: 127, output: 'Broadcast Address'}],
     selectDALIGroupAddress: [
                { value: 64, output: 'Group Address 0'}, { value: 65, output: 'Group Address 1'}, { value: 66, output: 'Group Address 2'},
                { value: 67, output: 'Group Address 3'}, { value: 68, output: 'Group Address 4'}, { value: 69, output: 'Group Address 5'},
                { value: 70, output: 'Group Address 6'}, { value: 71, output: 'Group Address 7'}, { value: 72, output: 'Group Address 8'},
                { value: 73, output: 'Group Address 9'}, { value: 74, output: 'Group Address 10'}, { value: 75, output: 'Group Address 11'},
                { value: 76, output: 'Group Address 12'}, { value: 77, output: 'Group Address 13'}, { value: 78, output: 'Group Address 14'},
                { value: 79, output: 'Group Address 15'}
            ],
     selectDALIShortAddress: [],  // Viene definito a run-time nel metodo getDALIShortAddress

     getLuxLevel: function(){
         return this.selectLuxLevel;
     },
     getLuxByType: function(value, type){
        if(value < 0)            return value;
        // Set lux-max-level in dipendenza del tipo di dispositivo
        var maxLevel = 255;
        var valuePerc = value;
        var valueDac = parseInt( (valuePerc * maxLevel / 100) + .5 );

        return valueDac;
     },
     getPercByLux: function(lux, type){
        if(lux < 0)            return lux;
        var maxLevel = 255;
        var valuePerc = parseInt( (lux * 100 / maxLevel) + .5 );
        return valuePerc;
     },
     getNearSelectValue: function(obj, level){
        if(level < 0)       return level;
        var selVal = 0;
        $.each( obj, function(item){
             if(this.value <= level && this.value >= 0)
                 selVal = this.value;
        } );
        return selVal;
     },
     getGroupID: function(){
        return this.selectGroupID;
     },
     getAction: function(){
        return this.selectAction;
     },
     getActionSimple: function(){
        return this.selectActionSimple;
     },
     getDaliActionSimple: function(){
        return this.selectDaliActionSimple;
     },
     getDaliGroupID: function(){
        return this.selectGroupID;
     },
     getDaliScenes: function(){
        return this.selectDaliScenes;
     },
     getPriorities: function(){
        return this.selectPriority;
     },
     getGroupStr : function(groupid){
            var str = [];

            if( (groupid & 1) > 0 )   str.push(' LG1');   if( (groupid & 2) > 0 )     str.push(' LG2');
            if( (groupid & 4) > 0 )   str.push(' LG3');   if( (groupid & 8) > 0 )     str.push(' LG4');
            if( (groupid & 16) > 0 )  str.push(' LG5');  if( (groupid & 32) > 0 )     str.push(' LG6');
            if( (groupid & 64) > 0 )  str.push(' LG7');  if( (groupid & 128) > 0 )    str.push(' LG8');
            if( (groupid & 256) > 0 )  str.push(' LG9');  if( (groupid & 512) > 0 )    str.push(' LG10');
            if( (groupid & 1024) > 0 )  str.push(' LG11');  if( (groupid & 2048) > 0 )    str.push(' LG12');
            if( (groupid & 4096) > 0 )  str.push(' LG13');  if( (groupid & 8192) > 0 )    str.push(' LG14');
            if( (groupid & 16384) > 0 )  str.push(' LG15');  if( (groupid & 32768) > 0 )    str.push(' LG16');

            if(str.length > 0)      str = str.join(',');
            else                    str = 'No group';

            return str;

     },
     getDALIBroadcastAddress: function(){
         return this.selectDALIBroadcastAddress;
     },
     getDALIGroupAddress: function(){
         return this.selectDALIGroupAddress;
     },
     getDALIShortAddress: function(maxAddress){
         var addrs = 64;
         if(maxAddress) addrs = maxAddress;
         if(this.selectDALIShortAddress.length === addrs)
             return this.selectDALIShortAddress;

         this.selectDALIShortAddress = [];
         for(var i = 0; i < addrs; i++){
            this.selectDALIShortAddress.push( { value: i, output: 'Short Address '+(i) } );
         }
         return this.selectDALIShortAddress;
     },
     getDALIAddressDescription: function(address){
        if(address >= 0 && address <= 63){
            var arr = this.getDALIShortAddress();
            return arr[address].output;
        }

        if(address >= 64 && address < 80){
            var arr = this.getDALIGroupAddress();
            return arr[address-64].output;
        }
        if(address == 127){
            var arr = this.getDALIBroadcastAddress();
            return arr[address-127].output;
        }

        return "Undefined Address";
     }



};


function md5(str) {
  //  discuss at: http://phpjs.org/functions/md5/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  depends on: utf8_encode
  //   example 1: md5('Kevin van Zonneveld');
  //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

  var xl;

  var utf8_encode = function(argString) {
    //  discuss at: http://phpjs.org/functions/utf8_encode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //   example 1: utf8_encode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
      return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
      start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
      var c1 = string.charCodeAt(n);
      var enc = null;

      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode(
          (c1 >> 6) | 192, (c1 & 63) | 128
        );
      } else if ((c1 & 0xF800) != 0xD800) {
        enc = String.fromCharCode(
          (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        );
      } else { // surrogate pairs
        if ((c1 & 0xFC00) != 0xD800) {
          throw new RangeError('Unmatched trail surrogate at ' + n);
        }
        var c2 = string.charCodeAt(++n);
        if ((c2 & 0xFC00) != 0xDC00) {
          throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
        }
        c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
        enc = String.fromCharCode(
          (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        );
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end);
        }
        utftext += enc;
        start = end = n + 1;
      }
    }

    if (end > start) {
      utftext += string.slice(start, stringl);
    }

    return utftext;
    }

  var rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  var addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  var _F = function (x, y, z) {
    return (x & y) | ((~x) & z);
  };
  var _G = function (x, y, z) {
    return (x & z) | (y & (~z));
  };
  var _H = function (x, y, z) {
    return (x ^ y ^ z);
  };
  var _I = function (x, y, z) {
    return (y ^ (x | (~z)));
  };

  var _FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var convertToWordArray = function (str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  var wordToHex = function (lValue) {
    var wordToHexValue = '',
      wordToHexValue_temp = '',
      lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  var x = [],
    k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  str = utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  return temp.toLowerCase();
}

$(function(){

    (function($) {

        function get_report(){

            var ids = ['#slItemProject619', '#slItemProject259', '#slItemProject302', '#slItemProject181', '#slItemProject359', '#slItemProject92', '#slItemProject218', '#slItemProject609', '#slItemProject288', '#slItemProject393', '#slItemProject612', '#slItemProject611', '#slItemProject401', '#slItemProject208', '#slItemProject512', '#slItemProject570',  '#slItemResponsible178', '#slItemResponsible691', '#slItemResponsible42', '#slItemResponsible542', '#slItemResponsible545', '#slItemResponsible492', '#slItemResponsible358', '#slItemResponsible678', '#slItemResponsible561', '#slItemResponsible633','#slItemResponsible634', '#slItemResponsible179', '#slItemResponsible703'];

            $.each(ids, function( index, value ) {
                var currentElem = $(value);
                console.debug(currentElem)
                $(currentElem).click();
            });

            $('#daysField').val(6);

            $('.form-horizontal button').click();

        }

        if(window.location.href.indexOf("actividad") > -1) {
            get_report();
        }
        else if(window.location.href.indexOf("obstaculo") > -1) {
            get_report();
        }
        else if(window.location.href.indexOf("comprometida") > -1) {
            get_report();
        }

        $(document).ready(function() {
            $('select').select2();
        });

        $('.cfData:contains("[DD]")').css('background-color', 'yellowgreen');
        $('.cfData:contains("[DP]")').css('background-color', 'yellowgreen');
        $('.cfData:contains("[MERGE]")').css('background-color', '#6e5494');
        $('.cfData:contains("[MERGE]")').css('color', '#ffffff');
        // Pull-request highlight
        $('.cfData:contains("PR")').css('background-color', '#6cc644');
        var regex = new RegExp("https://github.com/.*/.*/pull/[0-9]."); // expression here
        var $cfData = $(".cfData").filter(function () {
            return regex.test($(this).text());
        });
        $cfData.css('background-color', '#6cc644');
        // itemVisible
        $('.cfData').each(function() {
            if( $(this).hasClass('itemVisible') ) {
                $(this).css('background-color', 'orange');
            }
        });

        var noticeBar = $('#noticeBar');
        if (noticeBar.length){
            revissionElement = '<div class="noticeCat noticeWarn">'
                + '<div class="ntHeader">En Revisión</div>'
                + '    <div>'
                + '        <div class="ntColumns2" title="Tareas en estado de revisión con menos de 24 horas de creación">'
                + '            <div class="ntNumber ntRevission ntSuccess ntRevissionLess24h" onclick="$(\'.showAllTasks\').click();$(\'.ftStatus.fv-status10 > span.ftNotUnique\').click();$(\'.ftCreation24.fv-creation240 > span.ftNotUnique\').click()"></div>'
                + '            <div class="ntFooter">&lt;24h</div>'
                + '        </div>'
                + '        <div class="ntColumns2" title="Tareas en estado de revisión con más de 24 horas de creación">'
                + '            <div class="ntNumber ntRevission ntSuccess ntRevissionMore48h" onclick="$(\'.showAllTasks\').click();$(\'.ftStatus.fv-status10 > span.ftNotUnique\').click();$(\'.ftCreation24.fv-creation241 > span.ftNotUnique\').click()"></div>'
                + '            <div class="ntFooter">&gt;24h</div>'
                + '        </div>'
                + '    </div>'
                + '</div>'
                + '</div>';
            $('#noticeBar .noticeCat:nth-child(3)').after(revissionElement);
        }

    })(jQuery);

	(function($) {
		$.fn.changeElementType = function(newType) {
			var attrs = {};

			$.each(this[0].attributes, function(idx, attr) {
				attrs[attr.nodeName] = attr.nodeValue;
			});

			this.replaceWith(function() {
				return $("<" + newType + "/>", attrs).append($(this).contents());
			});
		}

	})(jQuery);

    var $header = $('#file-toolbar');
    var $content = $('embed');
    // Check file extension
    var $src = $content.attr('src');
    if (typeof $src !== "undefined") {
        var $extension = $src.substr(($src.lastIndexOf('.') + 1));
        switch ($extension) {
            //Plain text
            case 'txt':
            case 'TXT':
            case 'sql':
            case 'SQL':
            case 'log':
            case 'LOG':
                $('embed').changeElementType('iframe');
                var $content = $('iframe');
                break;
                // comma separated or tab separated
            case 'CSV':
            case 'csv':
            case 'TSV':
            case 'tsv':
                $('embed').addClass("file_include");
                $('embed').hide();
                parse_csv($content, $src);
                break;
                // ms excel
            case 'xlsx':
                $('embed').hide();
                parse_xlsx($src);
                break;
            case 'xls':
                $('embed').hide();
                parse_xls($src);
                break;
        }
        var $window = $(window).on('resize', function() {
            var height = $(this).height() - $header.outerHeight() - 9;
            $content.css('margin-top', $header.outerHeight());
            $content.css('width', "100%");
            $content.css('border', '0', 'important');
            $content.css('background-color', "#f5f5f5");
            $content.height(height);
        }).trigger('resize'); //on page load
    }
    // Define: Linkify plugin
    (function($) {
        var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
            url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g,
            linkifyThis = function() {
                var childNodes = this.childNodes,
                    i = childNodes.length;
                while (i--) {
                    var n = childNodes[i];
                    if (n.nodeType == 3) {
                        var html = $.trim(n.nodeValue);
                        if (html) {
                            html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(url1, '$1<a href="http://$2">$2</a>$3').replace(url2, '$1<a target="_blank" href="$2">$2</a>$5');
                            $(n).after(html).remove();
                        }
                    } else if (n.nodeType == 1 && !/^(a|button|textarea)$/i.test(n.tagName)) {
                        linkifyThis.call(n);
                    }
                }
            };
        $.fn.linkify = function() {
            return this.each(linkifyThis);
        };
    })(jQuery);
    // Usage example:
    $('div.cfContent').linkify();
    var csv = "";

    function parse_xlsx($src) {
        $("#wrapper").append('<div style="display:none;" id="fileurl"></div><div id="out"></div><div id="CSVTable"></div>');
        $("#out").html("<b>Cargando...</b>");
        $("#out").css('margin-top', $header.outerHeight());

        function to_csv(workbook) {
            var result = [];
            workbook.SheetNames.forEach(function(sheetName) {
                csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                if (csv.length > 0) {
                    //result.push("SHEET: " + sheetName);
                    //result.push("");
                    result.push(csv);
                }
            });
            return result.join("\n");
        }

        function process_wb(wb) {
            var output = to_csv(wb);
            var table = document.createElement("table");
            table.className = "table table-striped table-bordered";
            var rows = output.split("\n");
            for (var i = 0; i < rows.length; i++) {
                var row = table.insertRow(-1);
                var cells = rows[i].split(",");
                for (var j = 0; j < cells.length; j++) {
                    var cell = row.insertCell(-1);
                    cell.innerHTML = cells[j];
                }
            }
            $("#out").html("");
            $("#out").append(table);
        }
        var url = $src;
        var oReq;
        if (window.XMLHttpRequest) oReq = new XMLHttpRequest();
        else if (window.ActiveXObject) oReq = new ActiveXObject('MSXML2.XMLHTTP.3.0');
        else throw "XHR unavailable for your browser";
        document.getElementById('fileurl').innerHTML = '<a href="' + url + '">Download file</a>';
        oReq.open("GET", url, true);
        if (typeof Uint8Array !== 'undefined') {
            oReq.responseType = "arraybuffer";
            oReq.onload = function(e) {
                //if(typeof console !== 'undefined') console.log("onload", new Date());
                var arraybuffer = oReq.response;
                var data = new Uint8Array(arraybuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                var wb = XLSX.read(arr.join(""), {
                    type: "binary"
                });
                process_wb(wb);
            };
        } else {
            oReq.setRequestHeader("Accept-Charset", "x-user-defined");
            oReq.onreadystatechange = function() {
                if (oReq.readyState == 4 && oReq.status == 200) {
                    var ff = convertResponseBodyToText(oReq.responseBody);
                    if (typeof console !== 'undefined') console.log("onload", new Date());
                    var wb = XLSX.read(ff, {
                        type: "binary"
                    });
                    process_wb(wb);
                }
            };
        }
        oReq.send();
    }

    function parse_xls($src) {
        $("#wrapper").append('<div style="display:none;" id="fileurl"></div><div id="out"></div><div id="CSVTable"></div>');
        $('embed').hide();
        $("#out").html("<b>Cargando...</b>");
        $("#out").css('margin-top', $header.outerHeight());

        function to_csv(workbook) {
            var result = [];
            //console.log(workbook);
            workbook.SheetNames.forEach(function(sheetName) {
                csv = XLS.utils.make_csv(workbook.Sheets[sheetName]);
                if (csv.length > 0) {
                    result.push(csv);
                }
            });
            return result.join("\n");
        }

        function process_wb(wb) {
            var output = to_csv(wb);
            var table = document.createElement("table");
            table.className = "table table-striped table-bordered";
            var rows = output.split("\n");
            for (var i = 0; i < rows.length; i++) {
                var row = table.insertRow(-1);
                var cells = rows[i].split(",");
                for (var j = 0; j < cells.length; j++) {
                    var cell = row.insertCell(-1);
                    cell.innerHTML = cells[j];
                }
            }
            $("#out").html("");
            $("#out").append(table);
        }
        var url = $src;
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = function(e) {
            var arraybuffer = oReq.response;
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = data[i];
            var wb = XLS.read(arr, {
                type: "array"
            });
            process_wb(wb);
        }
        oReq.send();
    }

    function parse_csv($content, $src) {
        $("#wrapper").append('<div style="display:none;" id="fileurl"></div><div id="out"></div><div id="CSVTable"></div>');
        $('embed').hide();
        $("#out").html("<b>Cargando...</b>");
        $("#out").css('margin-top', $header.outerHeight());
        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', $src, true);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                blob = this.response;
                if (typeof(FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var table = document.createElement("table");
                        table.className = "table table-striped table-bordered";
                        var rows = e.target.result.split("\n");
                        for (var i = 0; i < rows.length; i++) {
                            var row = table.insertRow(-1);
                            var cells = rows[i].split(",");
                            for (var j = 0; j < cells.length; j++) {
                                var cell = row.insertCell(-1);
                                cell.innerHTML = cells[j];
                            }
                        }
                        $("#out").html("");
                        $("#out").append(table);
                    }
                    reader.readAsText(blob);
                } else {
                    alert("This browser does not support HTML5.");
                }
            }
        };
        xhr.send();
    }

    window.setInterval(function(){
        var revissionCount = $('#response #activesHoursWrapper .status10').length;
        var revissionCountLess24h = $('#response #activesHoursWrapper .status10').parent().siblings('.btHeader').children('span.creation240').length;
        var revissionCountMore24h = revissionCount - revissionCountLess24h;
        $('.ntRevission').text("");
        $('.ntRevissionLess24h').append(revissionCountLess24h);
        $('.ntRevissionMore48h').append(revissionCountMore24h);
    }, 1000);

});

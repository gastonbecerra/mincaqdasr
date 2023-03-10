// ------------------------------------------------------------------------------------------------------
// PENDIENTES GUI
// ------------------------------------------------------------------------------------------------------

// 2do: editar codigos desde la GUI
// 2do: borrar codigos desde la GUI
// 2do: borrar documentos desde la GUI
// 2do: editar documentos desde la GUI
// 2do: editar codigos desde R
// 2do: borrar codigos desde R
// 2do: borrar documentos desde R
// 2do: editar documentos desde R
// 2do: borrar fragmentos desde R
// 2do: editar fragmentos desde R
// 2do: concordancia inter-pares
// 2do: variables a un objeto estate, para poder resetearlas y mostrarlas en el monitor
// 2do: prompt para variables de usuario (e.g., annotation_user)
// 2do: prompot para agregar documentos?

// ------------------------------------------------------------------------------------------------------
// vars and default values
// ------------------------------------------------------------------------------------------------------

var data_json = [];
var current_document_i = false; 
var last_used_code = false;
var last_coded_document_i = false;
var last_coded_fragment_id = false;
var selected_text = false;
var selected_range_start = false;
var selected_range_end = false;
var current_fragment = false;
var current_fragment_id = false;
var changes_since_export = false;   //2do: no lo estoy trackeando
var target_code = false;
var code_sort_by = false;
var code_filter_by = '';
var show_monitor = false;
var annotation_user = false;

function estate_monitor() {
    if (!show_monitor) { $("#estate_monitor").hide(); }
    $("#estate_monitor").html( 
        "current_document_i: " + current_document_i + "<br>" +
        "last_used_code: " + last_used_code + "<br>" +
        "last_coded_document_i: " + last_coded_document_i + "<br>" +
        "last_coded_fragment_id: " + last_coded_fragment_id + "<br>" +
        "selected_text: " + selected_text + "<br>" +
        "selected_range_start: " + selected_range_start + "<br>" +
        "selected_range_end: " + selected_range_end + "<br>" +
        "current_fragment: " + current_fragment + "<br>" +
        "current_fragment_id: " + current_fragment_id + "<br>" +
        "changes_since_export: " + changes_since_export + "<br>" +
        "target_code: " + target_code + "<br>" +
        "code_sort_by: " + code_sort_by + "<br>" +
        "code_filter_by: " + code_filter_by + "<br>" +

        "show_monitor: " + show_monitor + "<br>" +
        "annotation_user: " + annotation_user + "<br>" +
        "<pre>" + JSON.stringify(data_json, null, '\t') + "</pre>" 
     );
}

function reset_output() {
    // reseting variables, not input data
    current_document_i = false; 
    last_used_code = false;
    last_coded_document_i = false;
    last_coded_fragment_id = false;
    selected_text = false;
    selected_range_start = false;
    selected_range_end = false;
    current_fragment = false;
    current_fragment_id = false;
    changes_since_export = false;   //2do: no lo estoy trackeando
    target_code = false;
    code_sort_by = false;
    code_filter_by = '';
    show_monitor = false;
    annotation_user = false;
}



// ------------------------------------------------------------------------------------------------------
// data handling fns
// ------------------------------------------------------------------------------------------------------

function get_documents() {
    if (typeof data_json.documents != "undefined") {
        var docs = [];
        for (var i = 0; i < data_json.documents.length; i++) {
            docs.push(data_json.documents[i]);
        }
        if (docs.length == 0) { 
            docs = false; 
            // alert('data_json length 0'); 
        }
        return docs;
    } else {
        return( false );
    }
}

function get_codes() {
    var codes = [];
    for (var i = 0; i < data_json.codes.length; i++) {
        codes.push(data_json.codes[i]);
    }
    return codes;
}

function get_codes_list() {
    
    var code_list = [];
    var codes = [];
    codes = get_codes();

    for (var i = 0; i < codes.length; i++) {
        
        let code = {
            i: i,
            code: codes[i],
            document_freq: 0,
            fragment_freq: 0,
            total_freq: 0,
            code_stat: false
        }
        
        for (var j = 0; j < data_json.documents_annotations.length; j++) {    
            if ( data_json.documents_annotations[j].codes.indexOf(i) !== -1 ) {
                code.document_freq++;
            }
        }

        for (var j = 0; j < data_json.fragments_annotations.length; j++) {
            if ( data_json.fragments_annotations[j].codes.indexOf(i) !== -1 ) {
                code.fragment_freq++;
            }
        }
        
        code.total_freq = code.document_freq + code.fragment_freq;
        code.code_stat = code.code + ' (d' + code.document_freq + ' f' + code.fragment_freq + ')';
        code_list.push(code);
    }

    if (code_filter_by !== false) {
        code_list = code_list.filter( code => code.code.toLowerCase().indexOf(code_filter_by.toLowerCase()) !== -1 );
    }
       
    if (code_sort_by == 'az') {
        code_list.sort(function(a, b) {
            var nameA = a.code.toUpperCase(); // ignore upper and lowercase
            var nameB = b.code.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {    return -1;  }
            if (nameA > nameB) {    return 1;   }
            return 0;   // names must be equal          
        });
    }

    if (code_sort_by == 'freq') {
        code_list.sort(function(a, b) {
            var nameA = a.total_freq; // ignore upper and lowercase
            var nameB = b.total_freq; // ignore upper and lowercase
            if (nameA < nameB) {    return 1;  }
            if (nameA > nameB) {    return -1;   }
            return 0;   // names must be equal
        });
    }
    
    return code_list;
}

function get_code_i(code) {
    var codes = get_codes();
    for (var i = 0; i < codes.length; i++) {
        if (codes[i] == code) { return i; }
    }
    return false;
}

function set_new_code( code ) {

    data_json.codes.push(code);
    return( get_code_i(code) );
}

function set_documents_annotations( document_i , code_i = false , memo = false , selected_tokens = false ) {
    document_i = parseInt(document_i);
    var is_new_document = true;
    
    for (var i = 0; i < data_json.documents_annotations.length; i++) {
        if (data_json.documents_annotations[i].document == document_i) {
            is_new_document = false;
            
            if (code_i) {
                code_i = parseInt(code_i);    
                if ( data_json.documents_annotations[i].codes.indexOf( code_i ) === -1 ) {
                    data_json.documents_annotations[i].codes.push( code_i );
                    last_used_code = code_i;
                    last_coded_document_i = document_i;
                } else {
                    data_json.documents_annotations[i].codes.splice( data_json.documents_annotations[i].codes.indexOf( code_i ), 1 );
                }
            }
            
            if (memo) {
                data_json.documents_annotations[i].memo = memo;
            }
            if (memo=="") {
                data_json.documents_annotations[i].memo = "";
            }
            
            if (selected_tokens) {
            }

            data_json.documents_annotations[i].annotation_update = new Date();
            data_json.documents_annotations[i].annotation_user = annotation_user; 
        }
    }

    if (is_new_document) {
        if (code_i) { 
            code_i = [ parseInt(code_i) ] ; 
            last_used_code = code_i ; 
            last_coded_document_i = document_i ; 
        } else { code_i = []; } 
        if (memo) {} else { memo = ""; }
        data_json.documents_annotations.push({
            "document": document_i,
            "codes": code_i,
            "memo": memo,
            // "selected_tokens": [],  //v2
            "annotation_update": new Date(),
            "annotation_user": annotation_user,
        });
    } 
    estate_monitor();
}

function get_document_codes( document_i ) {
    document_i = parseInt(document_i);
    var codes = [];
    for (var i = 0; i < data_json.documents_annotations.length; i++) {
        if (data_json.documents_annotations[i].document == document_i) { 
            codes = data_json.documents_annotations[i].codes;
        }
    }
    return codes;
}

function get_document_memo( document_i ) {
    document_i = parseInt(document_i);
    var memo = "";
    for (var i = 0; i < data_json.documents_annotations.length; i++) {
        if (data_json.documents_annotations[i].document == document_i) {
            memo = data_json.documents_annotations[i].memo;
        }
    }
    return memo;
}

function set_fragment( document_i , fragment_text ) {
    document_i = parseInt(document_i);
    var id = idx();
    data_json.fragments_annotations.push({
        "id": id,
        "document": document_i,
        "text": fragment_text,
        "start": selected_range_start,
        "end": selected_range_end,
        "codes": [],
        "memo": "",
        "annotation_update": new Date(),
        "annotation_user": annotation_user
    });
    return(id);
}

function delete_fragment( document_i , fragment_id  ) {
    document_i = parseInt(document_i) ;
    for (var i = 0; i < data_json.fragments_annotations.length; i++) {
        if ((data_json.fragments_annotations[i].document == document_i) && (data_json.fragments_annotations[i].id == fragment_id)) {
            data_json.fragments_annotations.splice(i, 1);
        }
    }
}

function set_fragments_annotations( document_i, fragment_id = false , code_i = false , memo = false  ) {

    document_i = parseInt(document_i);

    for (var i = 0; i < data_json.fragments_annotations.length; i++) {
        if (data_json.fragments_annotations[i].document == document_i && data_json.fragments_annotations[i].id == fragment_id) {
           
            if (code_i) {
                code_i = parseInt(code_i);    
                if ( data_json.fragments_annotations[i].codes.indexOf( code_i ) === -1 ) {
                    data_json.fragments_annotations[i].codes.push( code_i );
                    last_used_code = code_i;
                    last_coded_document_i = document_i;
                    last_coded_fragment_id = fragment_id;
                } else {
                    data_json.fragments_annotations[i].codes.splice( data_json.fragments_annotations[i].codes.indexOf( code_i ), 1 );
                }
            }

            if (memo) {
                data_json.fragments_annotations[i].memo = memo;
                if (memo=="") {
                    data_json.documents_annotations[i].memo = "";
                }
            }
            
            data_json.fragments_annotations[i].annotation_update = new Date();
            data_json.fragments_annotations[i].annotation_user = annotation_user; 

        }
    }
    estate_monitor();

}

function get_fragments( document_i ) {
    var fragments = [];
    for (var i = 0; i < data_json.fragments_annotations.length; i++) {
        if (data_json.fragments_annotations[i].document == document_i) {
            fragments.push(data_json.fragments_annotations[i]);
        }
    }
    return fragments;
}

function get_fragment_codes( fragment_id ) {
    
    // get output.fragments and filter by fragment_id
    var codes = [];
    for (var i = 0; i < data_json.fragments_annotations.length; i++) {
        if (data_json.fragments_annotations[i].id == fragment_id) {
            codes = data_json.fragments_annotations[i].codes;
        }
    }
    return codes;   
}

function get_fragment_memo( document_i , fragment_id ) {
    var fragment_memo = "";
    for (var i = 0; i < data_json.fragments_annotations.length; i++) {
        if (data_json.fragments_annotations[i].document == document_i && data_json.fragments_annotations[i].id == fragment_id) {
            fragment_memo = data_json.fragments_annotations[i].memo;
        }
    }
    return fragment_memo;
}

function clean_selection() {
    selected_text = false;
    selected_range_start = false;    
    selected_range_end = false;
    estate_monitor();
}


// ------------------------------------------------------------------------------------------------------
// data loading fns
// ------------------------------------------------------------------------------------------------------


function read_input_data( input ) {
    data_json = input;
}

function set_variables( show_monitor = false , annotation_user = false ) {
    var show_monitor = show_monitor;
    var annotation_user = annotation_user;
}


// ------------------------------------------------------------------------------------------------------
// GUI drawing fns
// ------------------------------------------------------------------------------------------------------


function draw_front() {

    console.log(data_json);
  
    $("#posta").html('');

    // front markup
    $("#posta").append( '<div id="container"></div>' );

        // insert document pane
        $("#container").append( '<h1 id="title">minCAQDAS</h1>' );
    
        // insert document pane
        $("#container").append( '<div id="documents_panel"></div>' );

            $("#documents_panel").append( '<p><strong>Document Navigation Panel</strong></p>' );

            // insert document navigation
            $("#documents_panel").append( '<div id="documents"></div>' );
            document_navigation(); 

            // insert document viewer
            $("#container").append( '<div id="documents_viewer_panel"></div>' );
            
                $("#documents_viewer_panel").append( '<p><strong>Document Viewer</strong></p>' );
                
                // insert document viewer
                $("#documents_viewer_panel").append( '<div id="document_viewer">(select a document from the <strong>Document Navigation Panel</strong>)</div>' );
                
                // annotate on documents
                $("#documents_viewer_panel").append( '<div id="annotate_document"></div>' );
                if ( current_document_i != false ) {
                    document_annotation_panel(); 
                }        
    
            // insert annotation panes
            $("#container").append( '<div id="annotate_panes"></div>' );
    
    
                // annotate on fragments
                $("#annotate_panes").append( '<div id="annotate_fragment"></div>' );
                fragment_annotation_panel();
    
            // insert codebook
            $("#container").append( '<div id="codebook_panel"></div>' );
            codebook_panel();

        // insert dump output
        $("#container").append( '<div id="dump"></div>' );
        export_and_dump_panel();
        estate_monitor();
}  

function document_navigation() {
    var document_panel = $("#documents_panel");
    document_panel.html(""); // refresh

    document_panel.append('<p><strong>Document Navigation</strong></p>');

    document_panel.append( '<div id="documents_panel_list"></div>' );
    var documents_panel_list = $("#documents_panel_list");

    documents = get_documents();

    if ( jQuery.isEmptyObject(documents) ) {
        documents_panel_list.append('<div id="xxx">(No documents found)</div>');

    } else {
        for (var i = 0; i < documents.length; i++) {
            if ( current_document_i && current_document_i == i ) { selected_item = "selected_item_document"; } else { selected_item = ""; }
    
            documents_panel_list.append( '<div class="document_navigation_item ' + selected_item + ' " document_i="' + i + '">' + 
                '<div class="document_navigation_i">' + (i+1) + '</div>' +
                '<div class="document_navigation_snippet">' + documents[i].substring(0, 50) + '...</div>' +
                 '</div>' );
        }
    }
}

function document_annotation_panel() {

    var annotate_doc_panel = $("#annotate_document");

    if (current_document_i === false) {
        annotate_doc_panel.hide();
        return;
    } else {
        annotate_doc_panel.show();
        annotate_doc_panel.html( "" ); // refresh every time

        codes = get_codes();
        for (var i = 0; i < codes.length; i++) {

            if ( get_document_codes(current_document_i).indexOf(i) === -1 ) { 
                } else {
                annotate_doc_panel.append( '<div class="document_code_item document_code_label" code_i="' + i + '">' + codes[i] + ' (X)</div>' );
            }

        }

        annotate_doc_panel.append('<textarea id="document_memo" placeholder="Include memos to this document...">' + get_document_memo(current_document_i) + '</textarea>');

        codebook_panel();

    }
}

function fragment_annotation_panel() {

    var annotate_fragment_panel = $("#annotate_fragment");

    if (current_document_i === false) {
        annotate_fragment_panel.hide();
        return;
    } else {
        annotate_fragment_panel.show();
        annotate_fragment_panel.html( "" ); // refresh every time

        annotate_fragment_panel.append('<p><strong>Fragment Annotations</strong>' +
            '<span id="create_fragment_button">+ Fragment</span></p>');
        
        annotate_fragment_panel.append('<div id="fragments_navigation"></div>');
        var fragments_navigation = $("#fragments_navigation");

        var fragments = get_fragments(current_document_i);
        
        codes = get_codes();

        for (var i = 0; i < fragments.length; i++) {    
            
            fragments_navigation.append( '<div class="fragments_item"></div>') ;
            var fragments_item = $('#fragments_navigation div.fragments_item:last');         
            
            if (current_fragment_id && fragments[i].id == current_fragment_id ) { 
                var fragment_class = "selected_item_fragment";
            } else {
                var fragment_class = "unselected_item";
            }

            fragments_item.append( '<span class="fragment_navigation_item ' + fragment_class + 
                '" fragment_id="' + fragments[i].id +
                '" fragment="' + fragments[i].text + '">' +
                fragments[i].text.substring(0, 25) ) + '... </span>';
                
                fragments_item.append('<span id="delete_fragment_button" fragment_id="' + fragments[i].id +
                    '">Delete fragment</span>');
            
            fragment_codes = get_fragment_codes( fragments[i].id );
            for (var j = 0; j < fragment_codes.length; j++) {
                fragments_item.append( '<span class="fragment_code_item fragment_code_label" ' +
                    'style="background-color:' + color_code(fragment_codes[j])  + '" ' +
                    'code_i="' + fragment_codes[j] + '">' + codes[fragment_codes[j]] + ' (X)</span>' );
            }
            
            fragments_item.append('<textarea class="fragment_memo" ' + 
                ' placeholder="Include memos for this fragment..."' + 
                ' fragment_id="' + fragments[i].id + '"' +
                '>' + get_fragment_memo( current_document_i, fragments[i].id ) + 
                '</textarea>');

        }
    }
    codebook_panel();

}

function view_document_content( document_i , current_fragment = false ) {
    var document_viewer = $("#document_viewer");
    
    text = data_json.documents[document_i];
    character_char = text.split('');
    character_classes = Array(character_char.length).fill('');
    character_fragments = Array(character_char.length).fill('');
    fragments_annotations = get_fragments(document_i);

    for (i = 0; i < character_char.length; i++) {
        fragments_annotations.forEach(function(item, index) {

            if ( i >= item.start && i <= item.end ) {

                character_fragments[i] = item.id ;
                character_classes[i] = "";  // clases son codigos + otras cuestiones de estilo

                if (i == item.start) {
                    character_classes[i] = character_classes[i] + ' fragment_start ' ;
                }
                if (i == item.end) {
                    character_classes[i] = character_classes[i] + ' fragment_end ' ;
                }

                if (current_fragment && item.id == current_fragment) {
                    character_classes[i] = character_classes[i] + ' selected_fragment ' ;
                }

                character_char[i] = '<character_annotation fragments="' + character_fragments[i] + 
                '" class="fragment ' + character_classes[i] + '" ' +
                '" fragment_id="' + item.id + '">' +
                character_char[i] + '</character_annotation>';

                item.codes.forEach(function(code, index) {                           
                    character_char[i] = '<character_annotation fragments="' + character_fragments[i] + 
                        '" class="fragment ' + character_classes[i] + '" ' + 
                        '" code="' + code + '" ' + 
                        '" fragment_id="' + item.id + '" ' +
                        '" style="background-color:' + color_code(code) + '">' +
                        character_char[i] + '</character_annotation>';
                });
            } 

        });
    }

    var document_viewer = $("#document_viewer");
    document_viewer.html( character_char.join('') );

}

function codebook_panel() {
    target_code = false;
    estate_monitor();

    var codebook_panel = $("#codebook_panel");
    codebook_panel.html('');
    
    // 2do: falta cuando hay selected text (new fragment)    
    if (( !current_fragment ) && ( current_document_i )) {
        target_code = "document";        
    }
    if ( current_fragment_id !== false) {
        target_code = "fragment";
    }
    
    if ( target_code ) {
        
        codebook_panel.append('<p><strong>Add code to <span class="codebook_target">' + target_code + '</strong></strong>' +
            '<span class="'+ target_code + '_code_item_automatic" code_behaviour="open">+ Open code</span>' + 
            '<span class="'+ target_code + '_code_item_automatic" code_behaviour="last">+ Last used code</span>' + 
            '<span class="'+ target_code + '_code_item_automatic" code_behaviour="quote">+ Quote code</span>' + 
            '</p>');
                
        codebook_panel.append('<div id="codebook_panel_content"></div>');
        var codebook_panel_content = $("#codebook_panel_content");
        
        codebook_panel_content.append('<div id="codebook_filter"></div>');
        var codebook_panel_filter = $("#codebook_filter");
        codebook_panel_filter.append('<p>Sort codes by ' +
            ' <span><a class="code_sort_by" code_sort_by="" href="#">[input order]</a></span> | ' +    
            ' <span><a class="code_sort_by" code_sort_by="az" href="#">[AZ]</a></span> | ' +
            ' <span><a class="code_sort_by" code_sort_by="freq" href="#">[freq.]</a></span> ' +
            '<input type="text" id="code_filter_by" placeholder="Filter codes..." value="' + code_filter_by + '"></p>');

        codebook_panel_content.append('<div id="codebook_code_list"></div>');
        codebook_code_list();
        
    } else {
        codebook_panel.append('<p><strong>Codes book</strong></p>');
        codebook_panel.append('<div id="xxx">(Select a fragment or document to apply / create codes)</div>');
        codebook_panel.append('<div id="xxx">(If provided, initial codes are listed in JSON monitor below)</div>');
    }

}

function codebook_code_list() {
    var codebook_code_list = $("#codebook_code_list");
    codebook_code_list.html('');

    
    codes = get_codes_list();
    for (var i = 0; i < codes.length; i++) {

        background_color = "white";
        
        if ( target_code == "document" && current_document_i ) {
            if ( get_document_codes(current_document_i).indexOf( codes[i].i ) === -1 ) { } else { 
                background_color = color_code( codes[i].i ); 
            }
        }
        if ( target_code == "fragment" && current_fragment_id ) {
            if ( get_fragment_codes(current_fragment_id).indexOf( codes[i].i ) === -1 ) { } else { 
                background_color = color_code( codes[i].i ); 
             }
        }
            
        codebook_code_list.append( '<div class="' + target_code + '_code_item codebook_code_item" ' + 
            ' style="background-color: ' + background_color + '" ' +
            ' code_i="' + codes[i].i + '">' + codes[i].code_stat + '</div>' );
    }

    estate_monitor();
}

function export_and_dump_panel() {
    var dump_panel = $("#dump");
    dump_panel.html('');
    dump_panel.append('<p><strong>Import/Export JSON</strong>' +
        '<span id="export" class="export-button">&nbsp;<a href="#">[Export JSON]</a></span>' + 
        '<span id="import" class="export-button">&nbsp;<a href="#">[Import JSON]</a></span>' + 
        '</p>');
    dump_panel.append('<input type="file" id="file-input" />');
    dump_panel.append('<p><strong>State/JSON monitor</strong>' +
        '<span id="monitor" class="export-button monitor">&nbsp;<a href="#">[Toggle state monitor and JSON preview]</a></span>' + 
        '</p>');
    dump_panel.append('<div id="estate_monitor"></div>');    

    //var dump_panel_buttons = $("#dump_buttons");
    // dump_panel_buttons.append('<div id="export" class="export-button">Export JSON without text</a></div>'); //v2
    //dump_panel_buttons.append('<div id="monitor" class="export-button monitor"><a href="#" id="">Toggle JSON monitor</a></div>');    
}


// ------------------------------------------------------------------------------------------------------
// GUI reactions fns
// ------------------------------------------------------------------------------------------------------


$(document).on('click', '.document_navigation_item', function() {
    current_fragment = false;
    var document_i = $(this).attr("document_i");
    current_document_i = document_i;
    current_fragment_id = false;
    document_navigation();
    view_document_content( document_i );
    document_annotation_panel(); 
    fragment_annotation_panel();
    estate_monitor();
});

$(document).on('click', '.document_code_item', function() {
    if (current_document_i === false) {
        alert('Select a document first');
    } else {
        var code_i = $(this).attr("code_i"); 
        set_documents_annotations( current_document_i , code = code_i );
        last_used_code = code_i;
        document_annotation_panel(); 
        codebook_panel();
    }
    estate_monitor();
});

$(document).on('click', '.document_code_item_automatic', function() {
    if (current_document_i === false) {
        alert('Select a document first');
    } else {
        var code_i = $(this).attr("code_i"); 
        
        var code_behaviour = $(this).attr("code_behaviour");
        if (code_behaviour == "last") { 
            if ( last_coded_document_i != current_document_i ) {
                set_documents_annotations( current_document_i , code = last_used_code ); 
            }
        }
        if (code_behaviour == "open") {
            var code = prompt("Please enter your code", "");
            if (code != null) {
                var code_i = set_new_code( code );
                set_documents_annotations( current_document_i , code = code_i );
            }        
        }
        if (code_behaviour == "quote") {   
            if ( selected_text != false && selected_text.trim() != "" ) {
                var code_i = set_new_code( selected_text.trim() );
                set_documents_annotations( current_document_i , code = code_i );
                clean_selection();
            } else {
                alert('Select some text first');
            }

        }
        document_annotation_panel(); 
        fragment_annotation_panel();
    }
    estate_monitor();
});

$(document).on('click', '.fragment_code_item_automatic', function() {
    if (current_fragment === false) {
        alert('Select a fragment first');
    } else {
        var code_i = $(this).attr("code_i"); 
        
        var code_behaviour = $(this).attr("code_behaviour");
        if (code_behaviour == "last") { 
            if ( last_coded_fragment_id != current_fragment_id ) {
                set_fragments_annotations( document_i = current_document_i, fragment_id = current_fragment_id, code_i = last_used_code );
            }
        }
        if (code_behaviour == "open") {
            var code = prompt("Please enter your code", "");
            if (code != null) {
                var code_i = set_new_code( code );
                set_fragments_annotations( document_i = current_document_i, fragment_id = current_fragment_id, code_i = code_i );
            }        
        }
        if (code_behaviour == "quote") {   
            if ( selected_text != false && selected_text.trim() != "" ) { 
                var code_i = set_new_code( selected_text.trim() );
                set_fragments_annotations( document_i = current_document_i, fragment_id = current_fragment_id, code_i = code_i );
                clean_selection();
            } else {
                alert('Select some text first');
            }

        }
        view_document_content( current_document_i , current_fragment_id );
        document_annotation_panel(); 
        fragment_annotation_panel();
    }
    estate_monitor();
});

$(document).on('click', '#create_fragment_button', function() {
    if (selected_text === false) {
        alert('Select a fragment first by highlighting text in the document viewer');
    } else {
        var fragment = selected_text.trim();
        if (fragment != "") {
            current_fragment_id = set_fragment( 
                document_i = current_document_i,
                fragment_text = fragment
            );
            current_fragment = selected_text;
            view_document_content( current_document_i , current_fragment_id );
            clean_selection();
            fragment_annotation_panel(); 
            estate_monitor();
        }
    }
});

$(document).on('click', '.fragment_code_item', function() {
    if (current_fragment_id === false) {
        alert('Select a fragment first');
    } else {
        var code_i = $(this).attr("code_i"); 
        set_fragments_annotations( document_i = current_document_i, fragment_id = current_fragment_id, code_i = code_i );
        last_used_code = code_i;
        view_document_content( current_document_i );
        fragment_annotation_panel();
    }
    estate_monitor();
});

$(document).on('click', '.fragment_navigation_item', function() {
    var fragment = $(this).attr("fragment");
    
    if ( current_fragment_id ==  $(this).attr("fragment_id") ) {
        current_fragment_id = false;
    } else {
        current_fragment_id = $(this).attr("fragment_id");
    }

    view_document_content( current_document_i , fragment_id = current_fragment_id );
    fragment_annotation_panel();
    estate_monitor();
});

// update the code list by filtering the codes with text in codebook_panel_filter
$(document).on('keyup', '#code_filter_by', function() {
    code_filter_by = $(this).val();
    codebook_code_list();
});    

$(document).on('click', '.code_sort_by', function() {
    code_sort_by = $(this).attr("code_sort_by");
    if (code_sort_by == "") {code_sort_by=false;}
    codebook_code_list();
});

$(document).on('change', '#document_memo', function() {
    var memo = $(this).val();
    set_documents_annotations( current_document_i, code = false, memo = memo );
    estate_monitor();
});

$(document).on('change', '.fragment_memo', function() {
    var memo = $(this).val();
    var fragment_id = $(this).attr("fragment_id");
    set_fragments_annotations( document_i = current_document_i, fragment_id = fragment_id, code_i = false, memo = memo );
    estate_monitor();
});

$(document).on('click', '#delete_fragment_button', function() {

    var fragment_id = $(this).attr("fragment_id");
    delete_fragment( document_i = current_document_i, fragment_id = fragment_id );
    current_fragment = false;
    fragment_annotation_panel();
    view_document_content( current_document_i );
    estate_monitor();

});

$(document).on('click', '#monitor', function() {
    show_monitor = !show_monitor;
    if (show_monitor) {
        $("#estate_monitor").show();
    } else {
        $("#estate_monitor").hide();
    }
    estate_monitor();
});

$(document).on('mouseup', '#document_viewer', function() {
    if (current_document_i === false) {
    } else {
        selected_text = window.getSelection().toString();   // https://developer.mozilla.org/en-US/docs/Web/API/Selection
        var range = window.getSelection().getRangeAt(0);
        var sel_start = range.startOffset;
        var sel_end = range.endOffset;      
        var container = $('#document_viewer')[0];
        var charsBeforeStart = getCharactersCountUntilNode(range.startContainer, container);
        var charsBeforeEnd = getCharactersCountUntilNode(range.endContainer, container);
        if(charsBeforeStart < 0 || charsBeforeEnd < 0) {
          console.warn('out of range');
          return;
        }
        var start_index = charsBeforeStart + sel_start;
        var end_index = charsBeforeEnd + sel_end -1 ;
        // console.log('start index', start_index);
        // console.log('end index', end_index);
        // console.log(container.textContent.slice(start_index, end_index));
        selected_range_end = end_index;
        selected_range_start = start_index;
        estate_monitor();
    }
});

$(document).on('click', '#export', function() { 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var filename = 'mincoder_' + yyyy + mm + dd + hh + min + '.json';
    exportToJsonFile(data_json, filename); //2do: revisar! lo llama dos veces?
});

$(document).on('click', '#import', function() { 
    $('#file-input').click();
    $('#file-input').change(handleFileSelect);
});


// ------------------------------------------------------------------------------------------------------
// aux fns
// ------------------------------------------------------------------------------------------------------


const idx = function() {
    return Math.random()
      .toString(36)
      .substr(2, 8);
};

function getCharactersCountUntilNode(node, parent) {
    // https://stackoverflow.com/questions/50843340/window-getselection-getrange0-does-not-work-when-text-is-wrapped-by-mark
    var walker = document.createTreeWalker(
      parent || document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var found = false;
    var chars = 0;
    while (walker.nextNode()) {
      if(walker.currentNode === node) {
        found = true;
        break;
      }
      chars += walker.currentNode.textContent.length;
    }
    if(found) {
      return chars;
    }
    else return -1;
}
  
function handleFileSelect (e) {
    var files = e.target.files;
    if (files.length < 1) {
        alert('select a JSON file...');
        return;
    }
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("load", function () {
        var json = JSON.parse(reader.result);
        // console.log(json);
        data_json = json;
        // document_navigation_panel();
        reset_output();
        draw_front();               
        estate_monitor();
    });

}

function exportToJsonFile(jsonData , filename) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let exportFileDefaultName = filename;
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

window.onbeforeunload = function(e) {   // trigger alert on windown close
//   return 'Please make sure to save your work before leaving this page.';
};

function color_code( code_i ) {
    var codes = data_json.codes;
    var color_brewer = [
        "rgba(255, 0, 0, .3)",
        "rgba(0, 255, 0, .3)",
        "rgba(0, 0, 255, .3)",
        "rgba(255, 255, 0, .3)",
        "rgba(255, 0, 255, .3)",
        "rgba(0, 255, 255, .3)",
        "rgba(255, 255, 255, .3)",
        "rgba(255, 128, 0, .3)",
        "rgba(255, 0, 128, .3)",
        "rgba(128, 255, 0, .3)"
    ];

    var i = 0;
    codes2 = codes.map(function(code_i, index) {
        if (i > color_brewer.length) {
            i=0;
        } 
        i++;
        return( color_brewer[index])
    });
    return codes2[code_i];
}
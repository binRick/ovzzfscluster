var socket = io('http://beo.infinitumtech.net:29232/');
socket.on('connect', function() {
    console.log('connected');

    //$(function() {
    var masterClickFunction = function(event) {
        w2ui['grid2'].clear();
        var record = this.get(event.recid);
        w2ui['grid2'].add([{
            recid: 0,
            name: 'ID:',
            value: record.recid
        }, {
            recid: 1,
            name: 'First Name:',
            value: record.fname
        }, {
            recid: 2,
            name: 'Last Name:',
            value: record.lname
        }, {
            recid: 3,
            name: 'Email:',
            value: record.email
        }, {
            recid: 4,
            name: 'Date:',
            value: record.sdate
        }]);
    };
    var masterRecords = [{
        recid: 1,
        fname: 'John',
        lname: 'doe',
        email: 'jdoe@gmail.com',
        sdate: '4/3/2012'
    }, {
        recid: 2,
        fname: 'Stuart',
        lname: 'Motzart',
        email: 'motzart@hotmail.com',
        sdate: '4/3/2012'
    }, {
        recid: 3,
        fname: 'Jin',
        lname: 'Franson',
        email: 'jin@yahoo.com',
        sdate: '4/3/2012'
    }, {
        recid: 4,
        fname: 'Susan',
        lname: 'Ottie',
        email: 'sottie@yahoo.com',
        sdate: '4/3/2012'
    }, {
        recid: 5,
        fname: 'Kelly',
        lname: 'Silver',
        email: 'kelly@gmail.com',
        sdate: '4/3/2012'
    }, {
        recid: 6,
        fname: 'Francis',
        lname: 'Gatos',
        email: 'frank@apple.com',
        sdate: '4/3/2012'
    }];
    var masterColumns = [{
        field: 'recid',
        caption: 'ID',
        size: '50px',
        sortable: true,
        attr: 'align=center'
    }, {
        field: 'lname',
        caption: 'Last Name',
        size: '30%',
        sortable: true
    }, {
        field: 'fname',
        caption: 'First Name',
        size: '30%',
        sortable: true
    }, {
        field: 'email',
        caption: 'Email',
        size: '40%'
    }, {
        field: 'sdate',
        caption: 'Start Date',
        size: '120px'
    }, ];

    var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
    var pstyle2 = 'border: 1px solid #fff; padding: 5px;';
    $('#main').w2layout({
        name: 'main',
        panels: [

            {type: 'top',style: pstyle2,size: 45,content: 'topper',},
            {type: 'bottom',style: pstyle2,size: 45,content: 'bottom',},
            {type: 'main',style: pstyle2, size: '80%',
                content: '<div id="layout" style="width: 100%; height: 600px;"></div>',},
        ],
    });
    $('#layout').w2layout({
        name: 'layout',
        panels: [{
            type: 'top',
            size: 50,
            resizable: true,
            style: pstyle,
            content: '<div id="toolbar" style="padding: 4px; border: 1px solid silver; border-radius: 3px"></div>'
        }, {
            type: 'left',
            size: 200,
            resizable: true,
            style: pstyle,
            content: '<div id="sidebar" style="height: 300px; width: 200px;"></div>'
        }, {
            type: 'right',
            size: 200,
            resizable: true,
            style: pstyle,
            content: 'right',
        }, {
            type: 'main',
            style: pstyle + 'border-top: 0px;',
            content: 'main',
            tabs: {
                active: 'tab1',
                tabs: [{
                    id: 'tab1',
                    caption: 'Tab 1'
                }, {
                    id: 'tab2',
                    caption: 'Tab 2'
                }, {
                    id: 'tab3',
                    caption: 'Tab 3'
                }, ],
                onClick: function(event) {
                    this.owner.content('main', event);
                }
            }
        }]
    });
    $('#sidebar').w2sidebar({
        name: 'sidebar',
        nodes: [{

            id: 'level-2-1',
            expanded: true,
            group: true,
            text: 'Containers',
            img: 'icon-folder',
            count: 3,
            nodes: [{
                id: 'ctid_1',
                text: 'CTID 1',
                icon: 'fa-star-empty'
            }]
        }]
    });
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [],
        onClick: function(event) {
            console.log('Target: ' + event.target, event);
        }
    });
    socket.on('newContainer', function(Container) {

        console.log('container', Container);
    });
    socket.on('pageItem', function(item) {
        console.log('toolbarItem received', item.type, item.data);
        w2ui[item.type].add(item.data);
    });
    var doubleGrid = '<div style="position: relative; height: 500px;">' +
        '<div id="grid1" style="position: absolute; left: 0px; width: 49.9%; height: 300px;"></div>' +
        '<div id="grid2" style="position: absolute; right: 0px; width: 49.9%; height: 300px;"></div>' +
        '</div>';
    //setTimeout(function(){
    w2ui['layout'].content('main', doubleGrid);

    $('#grid1').w2grid({
        name: 'grid1',
        columns: masterColumns,
        records: masterRecords,
        onClick: masterClickFunction,
    });
    $('#grid2').w2grid({
        show: {
            columnHeaders: false
        },
        name: 'grid2',
        columns: [{
            field: 'name',
            caption: 'Name',
            size: '100px',
            style: 'background-color: #efefef; border-bottom: 1px solid white; padding-right: 5px;',
            attr: "align=right"
        }, {
            field: 'value',
            caption: 'Value',
            size: '100%'
        }]
    });
    socket.emit('ready', {
        wow: 1123
    });
});
socket.on('event', function(data) {
    console.log('evemt', data);
});
socket.on('disconnect', function() {

    //                alert('discon');
});


 //JS File: ../js/ext/ux/Ext.ux.Crypto.SHA1.js 
 Ext.namespace('Ext.ux', 'Ext.ux.Crypto');

Ext.ux.Crypto.SHA1 = function() {
  // function 'f' [�4.1.1]
  var f = function(s, x, y, z) {
      switch (s) {
          case 0: return (x & y) ^ (~x & z);           // Ch()
          case 1: return x ^ y ^ z;                    // Parity()
          case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
          case 3: return x ^ y ^ z;                    // Parity()
      }
  };
  // rotate left (circular left shift) value x by n positions [�3.2.5]
  var ROTL = function(x, n) {
      return (x<<n) | (x>>>(32-n));
  };
  return {
    hash : function(msg) {
      // constants [�4.2.1]
      var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  
  
      // PREPROCESSING 
   
      msg += String.fromCharCode(0x80); // add trailing '1' bit to string [�5.1.1]
  
      // convert string msg into 512-bit/16-integer blocks arrays of ints [�5.2.1]
      var l = Math.ceil(msg.length/4) + 2;  // long enough to contain msg plus 2-word length
      var N = Math.ceil(l/16);              // in N 16-int blocks
      var M = new Array(N);
      for (var i=0; i<N; i++) {
          M[i] = new Array(16);
          for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
              M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
                        (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
          }
      }
      // add length (in bits) into final pair of 32-bit integers (big-endian) [5.1.1]
      // note: most significant word would be ((len-1)*8 >>> 32, but since JS converts
      // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
      M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14])
      M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;
  
      // set initial hash value [�5.3.1]
      var H0 = 0x67452301;
      var H1 = 0xefcdab89;
      var H2 = 0x98badcfe;
      var H3 = 0x10325476;
      var H4 = 0xc3d2e1f0;
  
      // HASH COMPUTATION [�6.1.2]
  
      var W = new Array(80); var a, b, c, d, e;
      for (var i=0; i<N; i++) {
  
          // 1 - prepare message schedule 'W'
          for (var t=0;  t<16; t++) W[t] = M[i][t];
          for (var t=16; t<80; t++) W[t] = ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
  
          // 2 - initialise five working variables a, b, c, d, e with previous hash value
          a = H0; b = H1; c = H2; d = H3; e = H4;
  
          // 3 - main loop
          for (var t=0; t<80; t++) {
              var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
              var T = (ROTL(a,5) + f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
              e = d;
              d = c;
              c = ROTL(b, 30);
              b = a;
              a = T;
          }
  
          // 4 - compute the new intermediate hash value
          H0 = (H0+a) & 0xffffffff;  // note 'addition modulo 2^32'
          H1 = (H1+b) & 0xffffffff; 
          H2 = (H2+c) & 0xffffffff; 
          H3 = (H3+d) & 0xffffffff; 
          H4 = (H4+e) & 0xffffffff;
      }
  
      return H0.toHexStr() + H1.toHexStr() + H2.toHexStr() + H3.toHexStr() + H4.toHexStr();
    }
  }
  
}();

/**
 * @class Number
 */
Ext.applyIf(Number.prototype, {
    /**
     * extend Number class with a tailored hex-string method (note toString(16) is implementation-dependant, and in IE returns signed numbers when used on full words)
     * @return {String} The number in Hexidecimal format.
     */
    toHexStr : function(){
        var s = '', v;
        for(var i = 7; i >= 0; i--) {
            v = (this >>> (i * 4)) & 0xf;
            s += v.toString(16);
        }
        return s;
    }
});

 //JS File: ../js/ext/ux/Ext.ux.ThemeMenu.js 
 /*
* Theme Selection Menu
*
* By Antimatter15 2008
* i donno. gpl v3 maybe.
*/

Ext.ux.ThemeMenu = function(config){
    Ext.ux.ThemeMenu.superclass.constructor.call(this, config);

    //this.plain = true;
	for(var theme = 0; theme < this.themeconfig.length; theme++){
	this.add(new Ext.menu.CheckItem({
    text: this.themeconfig[theme][1], //text title
	theme: theme,
	checked: (this.themeconfig[theme][2]==true),
    group: 'thememenu',
    checkHandler: function(item, checked) {
        if (checked){
		item.parentMenu.setTheme(item.theme)
		};
    }
}))
}

};

Ext.extend(Ext.ux.ThemeMenu, Ext.menu.Menu, {

cssPath: "../theme/css/", //mind the trailing slash
themeconfig:[ //array of stuff
 ['xtheme-default.css','Ext Blue Theme',true] //t3h default
,['xtheme-gray.css', 'Gray Theme']
,['xtheme-gray.css,xtheme-gray-extend.css', 'Extended Gray Theme'] //this is an "extend" theme, it is applied over another theme
,['xtheme-darkgray.css', 'Dark Gray Theme']
,['xtheme-black.css',  'Black Theme']
,['xtheme-olive.css', 'Olive Theme']
,['xtheme-purple.css', 'Purple Theme']
,['xtheme-slate.css', 'Slate Theme']
,['xtheme-peppermint.css',  'Peppermint Theme']
,['xtheme-chocolate.css', 'Chocolate Theme']
,['xtheme-slickness.css', 'SlicknesS Theme']
,['xtheme-pink.css', 'Pink Theme']
,['xtheme-midnight.css', "Midnight Theme"]
,['xtheme-green.css', "Green Theme"]
,['xtheme-indigo.css', "Indigo Theme"]
,['xtheme-silverCherry.css',"Silver Cherry Theme"]
,['xtheme-orange.css',"Orange Theme"]
],
setTheme: function(id){
//console.log(this)
var theme = this.themeconfig[id][0];
var themes = theme.split(",")
for(var i = 0; i < 4; i++){ //up to 4 themes on top of each other
if(themes[i]){
Ext.util.CSS.swapStyleSheet('csstheme'+i, this.cssPath + themes[i]);
}else{
Ext.util.CSS.removeStyleSheet('csstheme'+i);
}
}

}//end setTheme
});







 //JS File: ../js/ext/ux/Ext.ux.ToastWindow.js 
 Ext.ux.ToastWindowMgr = {
    positions: [] 
};

Ext.ux.ToastWindow = Ext.extend(Ext.Window, {
    initComponent: function(){
          Ext.apply(this, {
              iconCls: this.iconCls || 'information',
            width: 200,
            height: 100,
            autoScroll: true,
            autoDestroy: true,
            plain: false
          });
        this.task = new Ext.util.DelayedTask(this.hide, this);
        Ext.ux.ToastWindow.superclass.initComponent.call(this);
    },
    setMessage: function(msg){
        this.body.update(msg);
    },
    setTitle: function(title, iconCls){
        Ext.ux.ToastWindow.superclass.setTitle.call(this, title, iconCls||this.iconCls);
    },
    onRender:function(ct, position) {
        Ext.ux.ToastWindow.superclass.onRender.call(this, ct, position);
    },
    onDestroy: function(){
        Ext.ux.ToastWindowMgr.positions.remove(this.pos);
        Ext.ux.ToastWindow.superclass.onDestroy.call(this);
    },
    afterShow: function(){
        Ext.ux.ToastWindow.superclass.afterShow.call(this);
        this.on('move', function(){
               Ext.ux.ToastWindowMgr.positions.remove(this.pos);
            this.task.cancel();}
        , this);
        this.task.delay(4000);
    },
    animShow: function(){
        this.pos = 0;
        while(Ext.ux.ToastWindowMgr.positions.indexOf(this.pos)>-1)
            this.pos++;
        Ext.ux.ToastWindowMgr.positions.push(this.pos);
        this.setSize(200,100);
        this.el.alignTo(document, "br-br", [ -20, -20-((this.getSize().height+10)*this.pos) ]);
        this.el.slideIn('b', {
            duration: 1,
            callback: this.afterShow,
            scope: this
        });    
    },
    animHide: function(){
           Ext.ux.ToastWindowMgr.positions.remove(this.pos);
        this.el.ghost("b", {
            duration: 1,
            remove: true,
        scope: this,
        callback: this.destroy
        });    
    }
});  
 //JS File: ../js/ext/ux/Ext.ux.grid.CellActions.js 
 // vim: ts=4:sw=4:nu:fdc=4:nospell
/**
 * CellActions plugin for Ext grid
 *
 * Contains renderer for an icon and fires events when icon is clicked
 *
 * @author    Ing. Jozef Sakáloš
 * @date      22. March 2008
 * @version   $Id$
 *
 * @license Ext.ux.grid.CellActions is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

/**
 * The following css is required:
 *
 * .ux-cell-value {
 * 	position:relative;
 * 	zoom:1;
 * }
 * .ux-cell-actions {
 * 	position:absolute;
 * 	right:0;
 * 	top:-2px;
 * }
 * .ux-cell-actions-left {
 * 	left:0;
 * 	top:-2px;
 * }
 * .ux-cell-action {
 * 	width:16px;
 * 	height:16px;
 * 	float:left;
 * 	cursor:pointer;
 * 	margin: 0 0 0 4px;
 * }
 * .ux-cell-actions-left .ux-cell-action {
 * 	margin: 0 4px 0 0;
 * }
 */

/*global Ext */

Ext.ns('Ext.ux.grid');

// constructor and cellActions documentation
// {{{
/**
 * @class Ext.ux.grid.CellActions
 * @extends Ext.util.Observable
 * @constructor
 *
 * CellActions plugin causes that column model recognizes the config property cellAcions
 * that is the array of configuration objects for that column. The documentationi follows.
 *
 * THE FOLLOWING CONFIG OPTIONS ARE FOR COLUMN MODEL COLUMN, NOT FOR CellActions ITSELF.
 *
 * @cfg {Array} cellActions Mandatory. Array of action configuration objects. The following
 * configuration options of action are recognized:
 *
 * - @cfg {Function} callback Optional. Function to call if the action icon is clicked.
 *   This function is called with same signature as action event and in its original scope.
 *   If you need to call it in different scope or with another signature use 
 *   createCallback or createDelegate functions. Works for statically defined actions. Use
 *   callbacks configuration options for store bound actions.
 *
 * - @cfg {Function} cb Shortcut for callback.
 *
 * - @cfg {String} iconIndex Optional, however either iconIndex or iconCls must be
 *   configured. Field name of the field of the grid store record that contains
 *   css class of the icon to show. If configured, shown icons can vary depending
 *   of the value of this field.
 *
 * - @cfg {String} iconCls. css class of the icon to show. It is ignored if iconIndex is
 *   configured. Use this if you want static icons that are not base on the values in the record.
 *
 * - @cfg {String} qtipIndex Optional. Field name of the field of the grid store record that 
 *   contains tooltip text. If configured, the tooltip texts are taken from the store.
 *
 * - @cfg {String} tooltip Optional. Tooltip text to use as icon tooltip. It is ignored if 
 *   qtipIndex is configured. Use this if you want static tooltips that are not taken from the store.
 *
 * - @cfg {String} qtip Synonym for tooltip
 *
 * - @cfg {String} style Optional. Style to apply to action icon container.
 */
Ext.ux.grid.CellActions = function(config) {
	Ext.apply(this, config);

	this.addEvents(
		/**
		 * @event action
		 * Fires when user clicks a cell action
		 * @param {Ext.grid.GridPanel} grid
		 * @param {Ext.data.Record} record Record containing data of clicked cell
		 * @param {String} action Action clicked (equals iconCls);
		 * @param {Mixed} value Value of the clicke cell
		 * @param {String} dataIndex as specified in column model
		 * @param {Number} rowIndex Index of row clicked
		 * @param {Number} colIndex Incex of col clicked
		 */
		'action'
		/**
		 * @event beforeaction
		 * Fires when user clicks a cell action but before action event is fired. Return false to cancel the action;
		 * @param {Ext.grid.GridPanel} grid
		 * @param {Ext.data.Record} record Record containing data of clicked cell
		 * @param {String} action Action clicked (equals iconCls);
		 * @param {Mixed} value Value of the clicke cell
		 * @param {String} dataIndex as specified in column model
		 * @param {Number} rowIndex Index of row clicked
		 * @param {Number} colIndex Incex of col clicked
		 */
		,'beforeaction'
	);
	// call parent
	Ext.ux.grid.CellActions.superclass.constructor.call(this);

}; // eo constructor
// }}}

Ext.extend(Ext.ux.grid.CellActions, Ext.util.Observable, {

	/**
	 * @cfg {String} actionEvnet Event to trigger actions, e.g. click, dblclick, mouseover (defaults to 'click')
	 */
	 actionEvent:'click'

	/**
	 * @cfg {Number} actionWidth Width of action icon in pixels. Has effect only if align:'left'
	 */
	,actionWidth:20

	/**
	 * @cfg {String} align Set to 'left' to put action icons before the cell text. (defaults to undefined, meaning right)
	 */

	/**
	 * @private
	 * @cfg {String} tpl Template for cell with actions
	 */
	,tpl:'<div class="ux-cell-value" style="padding-left:{padding}px">'
			+'<tpl if="\'left\'!==align">{value}</tpl>'
		 	+'<div class="ux-cell-actions<tpl if="\'left\'===align"> ux-cell-actions-left</tpl>" style="width:{width}px">'
				+'<tpl for="actions"><div class="ux-cell-action {cls}" qtip="{qtip}" style="{style}">&#160;</div></tpl>'
			+'</div>'
			+'<tpl if="\'left\'===align">{value}</tpl>'
		+'<div>'
		
	/**
	 * Called at the end of processActions. Override this if you need it.
	 * @param {Object} c Column model configuration object
	 * @param {Object} data See this.processActions method for details
	 */
	,userProcessing:Ext.emptyFn

	// {{{
	/**
	 * Init function
	 * @param {Ext.grid.GridPanel} grid Grid this plugin is in
	 */
	,init:function(grid) {
		this.grid = grid;
//		grid.on({scope:this, render:this.onRenderGrid});
		grid.afterRender = grid.afterRender.createSequence(this.onRenderGrid, this);

		var cm = this.grid.getColumnModel();
		Ext.each(cm.config, function(c, idx) {
			if('object' === typeof c.cellActions) {
				c.origRenderer = cm.getRenderer(idx);
				c.renderer = this.renderActions.createDelegate(this);
			}
		}, this);


	} // eo function init
	// }}}
	// {{{
	/**
	 * grid render event handler, install actionEvent handler on view.mainBody
	 * @private
	 */
	,onRenderGrid:function() {

		// install click event handler on view mainBody
		this.view = this.grid.getView();
		var cfg = {scope:this};
		cfg[this.actionEvent] = this.onClick;
		this.view.mainBody.on(cfg);

	} // eo function onRender
	// }}}
	// {{{
	/**
	 * Returns data to apply to template. Override this if needed
	 * @param {Mixed} value 
	 * @param {Object} cell object to set some attributes of the grid cell
	 * @param {Ext.data.Record} record from which the data is extracted
	 * @param {Number} row row index
	 * @param {Number} col col index
	 * @param {Ext.data.Store} store object from which the record is extracted
	 * @returns {Object} data to apply to template
	 */
	,getData:function(value, cell, record, row, col, store) {
		return record.data || {};
	}
	// }}}
	// {{{
	/**
	 * replaces (but calls) the original renderer from column model
	 * @private
	 * @param {Mixed} value 
	 * @param {Object} cell object to set some attributes of the grid cell
	 * @param {Ext.data.Record} record from which the data is extracted
	 * @param {Number} row row index
	 * @param {Number} col col index
	 * @param {Ext.data.Store} store object from which the record is extracted
	 * @returns {String} markup of cell content
	 */
	,renderActions:function(value, cell, record, row, col, store) {

		// get column config from column model
		var c = this.grid.getColumnModel().config[col];

		// get output of the original renderer
		var val = c.origRenderer(value, cell, record, row, col, store);

		// get actions template if we need but don't have one
		if(c.cellActions && !c.actionsTpl) {
			c.actionsTpl = this.processActions(c);
			c.actionsTpl.compile();
		}
		// return original renderer output if we don't have actions
		else if(!c.cellActions) {
			return val;
		}

		// get and return final markup
		var data = this.getData.apply(this, arguments);
		data.value = val;
		return c.actionsTpl.apply(data);

	} // eo function renderActions
	// }}}
	// {{{
	/**
	 * processes the actions configs from column model column, saves callbacks and creates template
	 * @param {Object} c column model config of one column
	 * @private
	 */
	,processActions:function(c) {

		// callbacks holder
		this.callbacks = this.callbacks || {};

		// data for intermediate template
		var data = {
			 align:this.align || 'right'
			,width:this.actionWidth * c.cellActions.length
			,padding:'left' === this.align ? this.actionWidth * c.cellActions.length : 0
			,value:'{value}'
			,actions:[]
		};

		// cellActions loop
		Ext.each(c.cellActions, function(a, i) {

			// save callback
			if(a.iconCls && 'function' === typeof (a.callback || a.cb)) {
				this.callbacks[a.iconCls] = a.callback || a.cb;
			}

			// data for intermediate xtemplate action
			var o = {
				 cls:a.iconIndex ? '{' + a.iconIndex + '}' : (a.iconCls ? a.iconCls : '')
				,qtip:a.qtipIndex ? '{' + a.qtipIndex + '}' : (a.tooltip || a.qtip ? a.tooltip || a.qtip : '')
				,style:a.style ? a.style : ''
			};
			data.actions.push(o);

		}, this); // eo cellActions loop

		this.userProcessing(c, data);

		// get and return final template
		var xt = new Ext.XTemplate(this.tpl);
		return new Ext.Template(xt.apply(data));

	} // eo function processActions
	// }}}
	// {{{
	/**
	 * Grid body actionEvent event handler
	 * @private
	 */
	,onClick:function(e, target) {

		// collect all variables for callback and/or events
		var t = e.getTarget('div.ux-cell-action');
		var row = e.getTarget('.x-grid3-row');
		var col = this.view.findCellIndex(target.parentNode.parentNode);
		var c = this.grid.getColumnModel().config[col];
		var record, dataIndex, value, action;
		if(t) {
			record = this.grid.store.getAt(row.rowIndex);
			dataIndex = c.dataIndex;
			value = record.get(dataIndex);
			action = t.className.replace(/ux-cell-action /, '');
		}

		// check if we've collected all necessary variables
		if(false !== row && false !== col && record && dataIndex && action) {

			// call callback if any
			if(this.callbacks && 'function' === typeof this.callbacks[action]) {
				this.callbacks[action](this.grid, record, action, value, row.rowIndex, col);
			}

			// fire events
			if(true !== this.eventsSuspended && false === this.fireEvent('beforeaction', this.grid, record, action, value, dataIndex, row.rowIndex, col)) {
				return;
			}
			else if(true !== this.eventsSuspended) {
				this.fireEvent('action', this.grid, record, action, value, dataIndex, row.rowIndex, col);
			}

		}
	} // eo function onClick
	// }}}

});

// register xtype
Ext.reg('cellactions', Ext.ux.grid.CellActions);

// eof

 //JS File: ../js/ext/ux/Ext.ux.SliderTip.js 
 /**
 * @class Ext.ux.SliderTip
* @extends Ext.Tip
 * Simple plugin for using an Ext.Tip with a slider to show the slider value
 * stolen from the Ext Slider Example http://extjs.com/deploy/dev/examples/slider/slider.html
 */
 
Ext.ux.SliderTip = Ext.extend(Ext.Tip, {
 minWidth: 10,
 offsets : [0, -10],
 init : function(slider){
 slider.on('dragstart', this.onSlide, this);
 slider.on('drag', this.onSlide, this);
 slider.on('dragend', this.hide, this);
 slider.on('destroy', this.destroy, this);
 },

 onSlide : function(slider){
 this.show();
 this.body.update(this.getText(slider));
 this.doAutoWidth();
 this.el.alignTo(slider.thumb, 'b-t?', this.offsets);
 },

 getText : function(slider){
 return slider.getValue();
 }
});
 //JS File: ../js/ext/ux/Ext.ux.ColorField.js 
 /**
 * @class Ext.ux.ColorField
 * @extends Ext.form.TriggerField
 * Provides a very simple color form field with a ColorMenu dropdown.
 * Values are stored as a six-character hex value without the '#'.
 * I.e. 'ffffff'
 * @constructor
 * Create a new ColorField
 * <br />Example:
 * <pre><code>
var cf = new Ext.ux.ColorField({
	fieldLabel: 'Color',
	hiddenName:'pref_sales',
	showHexValue:true
});
</code></pre>
 * @param {Object} config
 */
 
Ext.ux.ColorField = function(config){
    Ext.ux.ColorField.superclass.constructor.call(this, config);
	this.on('render', this.handleRender);
};

Ext.extend(Ext.ux.ColorField, Ext.form.TriggerField,  {
   initComponent: function(){
    this.addEvents({
      "select": true
    })
   },
    /**
     * @cfg {Boolean} showHexValue
     * True to display the HTML Hexidecimal Color Value in the field
     * so it is manually editable.
     */
    showHexValue : false,
	
	/**
     * @cfg {String} triggerClass
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-color-trigger'
     * which displays a calendar icon).
     */
    triggerClass : 'x-form-color-trigger',
	
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "10", autocomplete: "off"})
     */
    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "10",
						 autocomplete: "off", maxlength:"6"},
	
	/**
	 * @cfg {String} lengthText
	 * A string to be displayed when the length of the input field is
	 * not 3 or 6, i.e. 'fff' or 'ffccff'.
	 */
	lengthText: "Color hex values must be either 3 or 6 characters.",
	
	//text to use if blank and allowBlank is false
	blankText: "Must have a hexidecimal value in the format ABCDEF.",
	
	/**
	 * @cfg {String} color
	 * A string hex value to be used as the default color.  Defaults
	 * to 'FFFFFF' (white).
	 */
	defaultColor: 'FFFFFF',
	
	maskRe: /[a-f0-9]/i,
	// These regexes limit input and validation to hex values
	regex: /[a-f0-9]/i,

	//private
	curColor: 'ffffff',
	
    // private
    validateValue : function(value){
		if(!this.showHexValue) {
			return true;
		}
		if(value.length<1) {
			this.el.setStyle({
				'background-color':'#' + this.defaultColor
			});
			if(!this.allowBlank) {
				this.markInvalid(String.format(this.blankText, value));
				return false
			}
			return true;
		}
		if(value.length!=3 && value.length!=6 ) {
			this.markInvalid(String.format(this.lengthText, value));
			return false;
		}
		this.setColor(value);
        return true;
    },

    // private
    validateBlur : function(){
        return !this.menu || !this.menu.isVisible();
    },
	
	// Manually apply the invalid line image since the background
	// was previously cleared so the color would show through.
	markInvalid : function( msg ) {
		Ext.ux.ColorField.superclass.markInvalid.call(this, msg);
		this.el.setStyle({
			'background-image': 'url(../theme/images/default/grid/invalid_line.gif)'
		});
	},

    /**
     * Returns the current color value of the color field
     * @return {String} value The hexidecimal color value
     */
    getValue : function(){
		return this.curValue || this.defaultValue || "FFFFFF";
    },

    /**
     * Sets the value of the color field.  Format as hex value 'FFFFFF'
     * without the '#'.
     * @param {String} hex The color value
     */
    setValue : function(hex){

		Ext.ux.ColorField.superclass.setValue.call(this, hex);
		this.setColor(hex);
    },
	
	/**
	 * Sets the current color and changes the background.
	 * Does *not* change the value of the field.
	 * @param {String} hex The color value.
	 */
	setColor : function(hex) {
		this.curColor = hex;
		
		this.el.setStyle( {
			'background-color': '#' + hex,
			'background-image': 'none'
		});
		if(!this.showHexValue) {
			this.el.setStyle({
				'text-indent': '-100px'
			});
			if(Ext.isIE) {
				this.el.setStyle({
					'margin-left': '100px'
				});
			}
		}
	},
	
	handleRender: function() {
		this.setDefaultColor();
	},
	
	setDefaultColor : function() {
		this.setValue(this.defaultColor);
	},

    // private
    menuListeners : {
        select: function(m, d){
            this.setValue(d);
        },
        show : function(){ // retain focus styling
            this.onFocus();
        },
        hide : function(){
            this.focus();
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },
	
	//private
	handleSelect : function(palette, selColor) {
    this.fireEvent("select",palette,selColor);
		this.setValue(selColor);
	},

    // private
    // Implements the default empty TriggerField.onTriggerClick function to display the ColorPicker
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.ColorMenu();
			this.menu.palette.on('select', this.handleSelect, this );
        }
        this.menu.on(Ext.apply({}, this.menuListeners, {
            scope:this
        }));
        this.menu.show(this.el, "tl-bl?");
    }
});

Ext.reg("colorfield",Ext.ux.ColorField)
 //JS File: ../js/ajaxanimator.js 
 /**
 * Ajax Animator
 *
 * @author    Antimatter15
 * @copyright (c) 2007-2008, by Antimatter15
 * @date      14. April 2008
 * @version   0.20+ Testing
 *
 * @license application.js is licensed under the terms of the Open Source GPL 2.0 license. 
 * 
 * License details: http://www.gnu.org/licenses/gpl.html
 */
 
/*global Ext, Application */
 
Ext.BLANK_IMAGE_URL = '../theme/images/default/s.gif';
Ext.ns('Ax'); //i got tired of typing ajaxanimator.xxx so i shortened it
 
// application main entry point
Ext.onReady(function() {
 
    Ext.QuickTips.init();
	
	if(Ax.v.dev && !Ax.developer){
	Ax.gs(1);
	new Ext.ux.ToastWindow({
    title: 'Testing Release',
    html: 'You are running an unstable testing release. '+
	'It is not intended for normal use. Please report bugs and post '+
	'comments about this release (build '+Ax.v.build+') frequently. Happy Testing!',
    iconCls: 'error'
	}).show(document);  
	}else{

	}
 
    // code here
 
}); // eo function onReady
 
 
Ax.set_version = function(version_object){
//Sets the current version of the applicaiton and does some operations with it
Ax.v = version_object

if(Ax.v.dev == true){
Ax.title = [Ax.v.app,Ax.v.release,Ax.v.stability,"Testing build",Ax.v.build].join(" ")
}else{
Ax.title = [Ax.v.app,Ax.v.release].join(" ")
}
document.title = Ax.title

} 
 
// eof
 //JS File: ../js/version.js 
 /*Auto-Generated Ajax Animator Version config (Markup Version II)*/
/*Generated By versions.php in /server/dev/compile/*/
Ax.set_version( /*START*/
{"app":"Ajax Animator","build":111,"release":"0.2","dev":true,"stability":"Pre Alpha","date":1212796111.95}
/*STOP*/ )
/*End Of File*/

 //JS File: ../js/misc/usage.js 
 //Usage statistics of the applicaiton

Ax.ustat = [];

Ax.gs = function(){
for(var i = 0; i < arguments.length; i++){
Ax.ustat.push(arguments[i])
}
}

//That's all folks!

//...okay... i lied, there's some more stat processing code...

Ax.ls = function(){
return Ax.ustat
}
 //JS File: ../js/misc/files.js 
 /*
files and direcories used via ajax

*/

Ax.files = {
  userlist: "../server/user/userlist.php",
  toolboxicons: "../img/icon/",
  silk: "../img/silk/"
}
 //JS File: ../js/misc/message.js 
 /*awesome little grey boxes that fall from the sky... stolen from Ext docs */

Ax.createBox = function(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
}
   
Ax.msg = function(title, format){
    if(!Ax.msgCt){
        Ax.msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
    }
    Ax.msgCt.alignTo(document, 't-t');
    var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
    var m = Ext.DomHelper.append(Ax.msgCt, {html:Ax.createBox(title, s)}, true);
    m.slideIn('t').pause(10).ghost("t", {remove:true});
}

 //JS File: ../js/misc/about.js 
 Ax.About = function(){
Ax.gs(6);
if(!Ax.aboutWindow){
Ax.aboutWindow = new Ext.Window({
    closable: true,
	iconCls: "tb_about",
    width: 410,
    height: 300,
    minimizable: true,
	title: "About Ajax Animator",
    border: false,
    plain: true,
    layout: 'border',
    buttons: [{
        text: 'Close',
        handler: function(){
            Ax.aboutWindow.hide();
        }
    }],
    items: [{
	region: "north",
	html: "<img src='../img/logo/logo4.png'>",
	height: 70
	},{
	xtype: "tabpanel",
    region: 'center',
    margins: '3 3 3 0', 
    activeTab: 0,
    defaults: {autoScroll:true},
 
    items:[{
        title: 'Version',
		html: "<b>Ajax Animator "+Ax.v.release+"</b>"+"<br>"+
    "App Name: "+Ax.v.app+"<br>"+
		"Release: "+Ax.v.release+"<br>"+
    "Stability: "+Ax.v.stability+"<br>"+
		"Build: "+Ax.v.build+"<br>"+
		"Testing: "+Ax.v.dev+"<br>"+
		"Release Date: "+Date.parseDate(Math.round(Ax.v.date),"U")+" ("+Ax.v.date+")<br>"+
		""
    },{
        title: 'Credits',
        html: '<b>Developers</b><br>'+
		'Antimatter15<br>'+
		"<b>Documentation</b><br>"+
		"Antimatter15<br>"+
		//'<b>Richdraw/OnlyPaths</b>'+ //not used yet
		"<b>Libraries/Extensions</b><br>"+
		'<i>Note: This is not a fully comprehensive list of everything used</i><br>'+
		'Ext v2.1 (http://extjs.com)<br>'+
		'Ext 2.x themes by Galdaka, J.C., madrabaz, and elyxr<br>'+
		'Ext.ux.ToastWindow by efattal<br>'+
		'Ext.ux.Crypto by vtswingkid<br>'+
		'php.js by Kevin van Zonneveld<br>'+
		'<b>Patches/Bugfixes</b><br>'+
		'http://extjs.com/forum/showthread.php?p=146135<br>'+
		'http://outroot.com/extjs/bug1/<br>'+ 
		'<b>Images/Icons</b><br>'+
		'Logo by Antimatter15<br>'+
		'Icons from silk by famfamfam<br>'+
		'Icons from richdraw by Mark Finkle<br>'+
		'Icons from OnlyPaths by josep_ssv<br>'+
		'Icons from Nuvola<br>'+
		'Loading icon from ajaxload.info<br>'
    },{
	title: "Special Thanks",
	html: "<b>Organizations</b><br>"+
	"liveswifers.org for their supportive community, and helping this project get started<br>"+
	"110mb.com hosting, for their reliability, cost (none), and helpful community<br>"+
	"Google Code for svn and project hosting - and just being awesome<br>"+
	"Extjs.com forums for excellent support<br>"+
	"<b>People</b><br>"+
	"inportb from 110mb forums for commentary<br>"+
	"brwainer from liveswifers.org for initial documentation, ideas, and suggestions<br>"+
	"BenjaminJ from liveswifers.org for support and ideas<br>"+
	"Brent Clancy (brclancy111/liveswif-050) for base login system<br>"+
	"RandomProductions for suggestions, fonts, and ideas<br>"+
	"OutOfLine for nice comments and motivation<br>"+
	"shanep for creating a forum for the project on liveswifers forums<br>"+
	""
	},{
		title: 'License',
		//autoLoad: "gpl-3.0-standalone.html"
		html: "GPL v3 (http://www.gnu.org/licenses/gpl-3.0.txt) <br><br>"+Ax.gpl+" <br><br><i>Please don't sue me</i>"
	}]
}]
});
 
Ax.aboutWindow.on('minimize', function(){
    Ax.aboutWindow.toggleCollapse();
});
}
Ax.aboutWindow.show();
}

Ax.gpl = 
"This program is free software: you can redistribute it and/or modify"+"<br>"+
"it under the terms of the GNU General Public License as published by"+"<br>"+
"the Free Software Foundation, either version 3 of the License, or"+"<br>"+
"(at your option) any later version."+"<br>"+
"<br><br>"+
"This program is distributed in the hope that it will be useful,"+"<br>"+
"but WITHOUT ANY WARRANTY; without even the implied warranty of"+"<br>"+
"MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the"+"<br>"+
"GNU General Public License for more details."+"<br>"+
"<br><br>"+
"You should have received a copy of the GNU General Public License"+"<br>"+
"along with this program.  If not, see http://www.gnu.org/licenses/.";


 //JS File: ../js/misc/help.js 
 Ax.keyGuide = function(){
Ax.gs(5);
Ext.MessageBox.alert("Keyboard Shortcuts (non-functional)",
"<b>Ctrl+C </b> Copy Selected Object\n<br><b>"+
"Ctrl+V </b> Paste Object\n<br><b>"+
"Ctrl+Z </b> Undo Action\n<br><b>"+
"Ctrl+S </b> Open Save/Open window\n<br><b>"+
"-> (right arrow key) </b> Next Frame\n<br><b>"+
"Page Down </b> Next Frame\n<br><b>"+
"<- (left arrow key) </b> Previous Frame\n<br><b>"+
"Page Up </b> Previous Frame\n<br><b>"+
"P </b> Play Animation (within canvas)\n<br><b>"+
"S </b> Stop Animation Playback (within canvas)\n<br><b>"+
"Delete </b> Delete Selected Object (or delete frame if nothing is selected)\n<br><b>"+
"R </b> Clear Current Frame\n<br><b>"+
"F6</b> To Keyframe\n<br>")
}



 //JS File: ../js/misc/misc.js 
 /*
A whole lot of random scripts
*/


Ax.util = {
htmlentities : function(s){
//Slightly compressed version of the htmlentities function combined with nl2br
//  original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net) from php.js

var div = document.createElement('div'), text = document.createTextNode(s);
div.appendChild(text);
return div.innerHTML.replace(/([^>])\n/g, '$1<br />\n')
}

}



Ax.preload = function(){
Ax.showBusy()
Ax.setStatus({text:"Preloading Icons"})

var images = ["../img/img/silk/page_add.png","../img/img/silk/folder_go.png","../img/img/silk/disk.png","../img/img/silk/page_white_flash.png","../img/img/silk/computer_go.png","../img/img/silk/drive_web.png","../img/img/silk/world_link.png","../img/img/silk/textfield.png","../img/img/silk/arrow_undo.png","../img/img/silk/arrow_redo.png","../img/img/silk/cut_red.png","../img/img/silk/page_copy.png","../img/img/silk/page_paste.png","../img/img/silk/delete.png","../img/img/silk/page_white_flash.png","../img/img/silk/application_double.png","../img/img/silk/color_wheel.png","../img/img/silk/paintbrush.png","../img/img/silk/bug_go.png","../img/img/silk/script_code_red.png","../img/img/silk/plugin_edit.png","../img/img/silk/report.png","../img/img/silk/arrow_refresh.png","../img/img/silk/page_delete.png","../img/img/silk/add.png","../img/img/silk/key_add.png","../img/img/silk/resultset_last.png","../img/img/silk/bin.png","../img/img/silk/control_play.png","../img/img/silk/control_pause.png","../img/img/silk/control_fastforward.png","../img/img/silk/control_rewind.png","../img/img/silk/control_end.png","../img/img/silk/control_start.png","../img/img/silk/database_refresh.png","../img/img/silk/plugin.png","../img/img/silk/package_add.png","../img/img/silk/key_go.png","../img/img/silk/door_out.png","../img/img/silk/folder_explore.png","../img/img/silk/vcard.png","../img/img/silk/keyboard.png","../img/img/silk/information.png","../img/img/silk/comments.png","../img/img/silk/bug.png","../img/img/silk/book.png","../img/img/silk/bricks.png","../img/img/silk/lightbulb.png","../img/img/silk/money.png"] 
var loader = [];

this.checkload = function(){
var x = 0;
for(var i = 0; i < loader.length; i++){
if(loader[i].complete){
x ++
}
}
Ax.showBusy()
Ax.setStatus({text:"Preloaded "+x+" out of "+loader.length})

if(x/loader.length != 1){
setTimeout(this,100);
}else{
Ax.setStatus({text: "Finished Preloading",clear: true})
}

}

for(var i = 0; i < images.length; i++){
loader[i] = new Image()
loader[i].src = "../css/"+images[i]
}
this.checkload()
}
 //JS File: ../js/misc/docs.js 
 /*
Documentation (FAQ, Manual, Etc.)
*/

Ax.loadTab = function(object){
Ax.viewport.findById("maintabpanel").add(object)
}
Ax.loadFAQ = function(){
Ax.loadTab({xtype: "faq"})
Ax.gs(2);
}
Ax.loadManual = function(){
Ax.loadTab({xtype: "manual"})
Ax.gs(3);
}


Ax.FAQ = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,{
	title: "FAQ",
	closable: true,
	iconCls: "tb_docs",
	layout: "fit",
	border: false,
	items: {
	title: "FAQ",
	border: false,
	iconCls: "tb_docs",
	html: "SUM FAQ STUFF HERE!!!"
	}
	
  })

   Ax.FAQ.superclass.initComponent.apply(this, arguments);
  }
  })
  
Ext.reg("faq",Ax.FAQ)

Ax.Manual = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,{
	title: "Manual",
	closable: true,
	iconCls: "tb_docs",
	layout: "fit",
	border: false,
	items: {
	title: "Manual",
	border: false,
	iconCls: "tb_docs",
	html: "SUM Manual STUFF HERE!!!"
	}
	
  })

   Ax.Manual.superclass.initComponent.apply(this, arguments);
  }
  })
  
Ext.reg("manual",Ax.Manual)
 //JS File: ../js/misc/bugs.js 
 Ax.Error = function(){
Ax.gs(4);
var ErrorWindow = new Ext.Window({
    closable: true,
    width: 410,
    height: 300,
    minimizable: true,
	title: "Ajax Animator has encountered a problem",
    border: false,
    plain: true,
    layout: 'border',
    buttons: [
	
	{
        text: 'Cancel',
        handler: function(){
            ErrorWindow.close();
        }
    },{
		text: 'Send (recomended)',
		handler: function(){
			Ax.msg("Sending Bug Report","We are sending your bug report");
			ErrorWindow.close();
		}
	}
	
	],
    items: [{
	split: true,
	height: 80,
	region: "north",
	html: "<b>Ajax Animator has encountered a problem."+
	" This is likely due to a bug in the software. You may"+
	" continue using the software as normal, but there might"+
	" be some issues. We are sorry for the inconvienience, "+
	"and you may submit a bug report for us to fix it.</b><br>"
	},{
	region: "center",
	html: "scarey"
}]
});
 
ErrorWindow.on('minimize', function(){
    ErrorWindow.toggleCollapse();
});

ErrorWindow.show();
}


//onerror = Ax.Error



 //JS File: ../js/drawing/tools.js 
   Ax.ToolItem = Ext.extend(Ext.Component,{
  tool: "",
  img: "",
  selected: false,
  onSelect: function(){},
  onUnselect: function(){},
  
  unselect: function(){
  this.onUnselect(this);
  this.el.dom.className = "toolboxItem"
  },
  initComponents: function(){
  Ax.ToolItem.superclass.initComponent.apply(this, arguments);
  },
  handleMouseEvents: function(event,del){
  
    //console.log(arguments)
    if(!this.el.hasClass("tbx_sel")){
    //If it is not selected
    this.el.dom.className = "toolboxItem"; //remove all classes except the standard one
    switch(event.type){
    case "mouseover":
    this.el.addClass("tbx_ovr")
    break;
    case "mouseout":
    this.el.addClass("tbx_idl")
    break;
    case "mousedown":
	//Ax.gs(9)
    this.onSelect(this);
    this.el.addClass("tbx_sel");
    this.selected = true
    break;
    }
    }else{
    switch(event.type){
    case "mousedown":
	this.onUnselect(this);
    this.el.dom.className = "toolboxItem";
    this.selected = false;

    }
    //If it is already selected
     }
  },
  onRender: function(ct){
  if(!this.template){
  this.template = new Ext.Template(
  //'<div id="{tool}" class="toolboxItem tbx_idl">',
  '<img src="{img}" alt="{tool}" class="toolboxItem"></div>');
  }
  if(!this.el){
  this.el = ct.createChild()
  }
  
  this.template.append(this.el,{tool: this.tool, img: this.img})
  
  
  this.el.dom.className = "toolboxItem tbx_idl"; //idle/toolbox
  
  
  this.el.on("mousedown",this.handleMouseEvents,this)
  this.el.on("mouseover",this.handleMouseEvents,this)
  this.el.on("mouseout",this.handleMouseEvents,this)
  
  if(this.qtip){
  //console.log(this.qtip)
  Ext.QuickTips.register({
    target: this.el.dom.firstChild,
    title: 'Draw Tools',
    text: this.qtip
    //dismissDelay: 20
  });
  }

  }
  
  })
  
  Ext.reg("tbxitem",Ax.ToolItem)
 //JS File: ../js/drawing/toolbox.js 
 Ax.ToolsPanel = Ext.extend(Ext.Panel,{
toolConfig: {
	"select": ["select.gif","Select Shapes"],
	"rect": ["rectangle.gif","Draw Rectangle"],
	"roundrect": ["roundrect.gif","Draw Rounded Rectangle"],
	"ellipse": ["circle.gif","Draw Ellipse/Circle"],
	"line": ["line.gif","Draw Line"],
	"path":["path.gif","Draw freeform path"],
	"polygon":["polygon.gif","Draw Polygon"],
		"text":["text.gif","Draw text"],
	"image": ["image.gif", "Draw Image/Picture"],



	"shape":["shape.gif","Draw Shape from library"],
	"clear": ["reset.gif","Clear/Empty Frame"],
	"delete": ["delete.gif","Delete selected shape"]
},
changeTool: function(tool){
Ax.setTool(tool.tool);

//report usage statistics
//* take out that first "/" to disable
Ax.gs(({select:10,rect:11,roundrect:12,
ellipse:13,line:14,path:15,
polygon:16,text:17,image:18,
shape:19,clear:20,"delete":21})[tool.tool])
/**///*//for my text editor (notepad2, though i normally use notepad++ which doesn't face this issue)


for(var tool_id in this.toolConfig){
Ax.viewport.findById("tool_"+tool_id).unselect()
}
//this.toolConfig[this.tool][2]()


},

initComponent: function(){
var ia = []
for(var tool in this.toolConfig){


ia.push(new Ax.ToolItem({
tool:tool,
id: "tool_"+ tool,
toolConfig: this.toolConfig,
qtip: this.toolConfig[tool][1],
img:Ax.files.toolboxicons+this.toolConfig[tool][0], //ooh! gets the toolbox icons dir, and adds it to the stuff
onSelect: this.changeTool
}))
	
}
  
  
Ext.apply(this,{
layout: "table",
border: false,
layoutConfig: {
        // The total column count must be specified here
        columns: 2
    },
	items: ia
  })

   Ax.ToolsPanel.superclass.initComponent.apply(this, arguments);
  }
  })
  
  Ext.reg("toolbox",Ax.ToolsPanel)
  
  
  
  
  
  
  

 //JS File: ../js/drawing/colorpanel.js 
 Ax.Color = {
  update: function(){},
  line: "000000",
  fill:"FF0000",
  width: 1 //okay, so width isn't really a color..
}

Ax.ColorPanel = Ext.extend(Ext.Panel,{
  initComponent: function(){
    this.SliderTip = new Ext.ux.SliderTip({
      getText: function(slider){
        return String.format('Line Width: {0}px', slider.getValue());
      }
    })
    Ext.apply(this,{
    border: false,
    items: [
      {xtype: "label",style: "font-size: xx-small; margin-left: 3px", text: "Line"},
      {xtype: "slider", maxValue: 20,plugins: this.SliderTip, value: Ax.Color.width, listeners: {
        "drag":function(slider,event){
          Ax.Color.width = slider.getValue(); //huh? width isn't a color? you're crazy
          Ax.Color.update("lw");
        }
      }},
      {xtype: "colorfield", width: 48, defaultColor:Ax.Color.line, listeners: {
        "select":function(palette,hex){
        Ax.Color.line = hex;
        Ax.Color.update("lc");
        }
      }},
      {xtype: "label",style: "font-size: xx-small; margin-left: 3px", text: "Fill"},
      {xtype: "colorfield", width: 48, defaultColor:Ax.Color.fill, listeners: {
        "select":function(palette,hex){
        Ax.Color.fill = hex;
        Ax.Color.update("fc");
        }
      }}
    ]
    })


    Ax.ColorPanel.superclass.initComponent.apply(this, arguments);
  }
})
Ext.reg("drawpanel",Ax.ColorPanel)


 //JS File: ../js/drawing/onlypaths.js 
 /*----------------------------------------------------------------------------
 RICHDRAW 1.0
 Vector Graphics Drawing Script
 -----------------------------------------------------------------------------
 Created by Mark Finkle (mark.finkle@gmail.com)
 Implementation of simple vector graphic drawing control using SVG or VML.
 -----------------------------------------------------------------------------
 Copyright (c) 2006 Mark Finkle

 This program is  free software;  you can redistribute  it and/or  modify it
 under the terms of the MIT License.

 Permission  is hereby granted,  free of charge, to  any person  obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the  Software without restriction,  including without limitation
 the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 Software is  furnished  to do  so, subject  to  the  following  conditions:
 The above copyright notice and this  permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 DEALINGS IN THE SOFTWARE.
 -----------------------------------------------------------------------------
 Dependencies: (SVG or VML rendering implementations)
 History:
 2006-04-05 | Created
 --------------------------------------------------------------------------*/
var xpArray=new Array();
var ypArray=new Array(); 
var setPoints=new Array(); 

var inout='';//true;
var typeTransform='';

var contmove=0;  
var zoomx=0;
var zoomy=0;
var zoomscale=1;
var zoommode='frame'; //more minus frame



//////////////

 //++
 var data_path_close=true;
 var data_text_family='';
 var data_text_size=19
 var data_text_messaje='';
 var data_image_href='';   
 
 var numClics=0;  

////////////

function RichDrawEditor(elem, renderer) {
  this.container = elem;
	this.gridX = 10;
	this.gridY = 10;
  this.mouseDownX = 0;  
  this.mouseDownY = 0;    
  this.clicX = 0;  
  this.clicY = 0;
  
  this.inputxy = [];
  
  this.nowDraw=false;
  this.onInputXY = function(){};
  this.gridWidth = 20;
  
  
  this.mode = '';

  this.fillColor = '';  
 
  this.lineColor = '';
  this.lineWidth = '';
  this.selected = null;   
  this.focusin = null;  
  this.lineOpac = 1;
  this.fillOpac = 1;
  this.opac = 1;
  
  this.pathsEdit = false;
  
  this.previusBox=null; 
  this.initialPath='';
  this.clipboard=null;
  this.selectedBounds = { x:0, y:0, width:0, height: 0 };

	this.onselect = function() {}
	this.onunselect = function() {}

  this.renderer = renderer;
  
  this.renderer.init(this.container);
  
  this.renderer.editor = this;
  
  /*
  this.onMouseDownListener = this.onMouseDown.bindAsEventListener(this);
  this.onMouseUpListener = this.onMouseUp.bindAsEventListener(this);
  this.onDragListener = this.onDrag.bindAsEventListener(this);
  this.onResizeListener = this.onResize.bindAsEventListener(this);
  this.onDrawListener = this.onDraw.bindAsEventListener(this);
  this.onRotateListener = this.onRotate.bindAsEventListener(this);
  this.onScaleListener = this.onScale.bindAsEventListener(this);
  this.onTransformListener = this.onTransform.bindAsEventListener(this);
  this.onTranslateListener = this.onTranslate.bindAsEventListener(this);
  this.onKeyPressListener=this.onKeyPress.bindAsEventListener(this);
  this.onHitListener = this.onHit.bindAsEventListener(this); 
  //++
  this.onClicListener = this.onClic.bindAsEventListener(this); 
  //++
  this.onEndLineListener = this.onEndLine.bindAsEventListener(this);
  
  this.onSelectStartListener = this.onSelectStart.bindAsEventListener(this);
  */
  //Ext.get(this.container).on( "mouseout", this.onRotate,this); 
  //Ext.get(this.container).on( "mouseout", this.onTransform,this);                                                         
  //Ext.get(this.container).on( "mouseover", this.onTranslate,this);
  Ext.get(this.container).on( "mousedown", this.onMouseDown,this);
  Ext.get(this.container).on( "mouseup", this.onMouseUp,this);   
  
  Ext.get(this.container).on( "mousemove", this.onTranslate,this); 
  //++
  Ext.get(this.container).on( "dblclick", this.onEndLine,this);
  
  Ext.get(this.container).on( "selectstart", this.onSelectStart,this);  
  //Event.observe(document, "keypress", this.onKeyPress,this);  
  
}


RichDrawEditor.prototype.clearWorkspace = function() {
	this.container.innerHTML = '';
};



RichDrawEditor.prototype.deleteSelection = function() {
  if (this.selected) {
    this.renderer.remove(this.container.ownerDocument.getElementById('tracker'));
    this.renderer.remove(this.selected);
    this.selected = null;
  }
};
RichDrawEditor.prototype.toFront = function(order) {
  if (this.selected) { 
     //var copy= this.selected;
     //this.onunselect(this);
      //this.selected =
      this.renderer.index(this.selected, order);
      //this.selected =this.renderer.index(this.selected);   
      //this.selected.id = 'shape:' + createUUID();
      //Ext.get(this.selected).on( "mousedown", this.onHit,this);   
      //this.unselect();
     
  }
};
RichDrawEditor.prototype.deleteAll = function() {   
  if (this.selected) {  
    // this.renderer.remove(this.container.ownerDocument.getElementById('tracker'));
  
  this.renderer.removeAll();
  }
};

RichDrawEditor.prototype.select = function(elem) {
  if (elem == this.selected)
    return;

  this.selected = elem;
  this.renderer.showTracker(this.selected,this.pathsEdit);
  this.onselect(this);
  
};


RichDrawEditor.prototype.unselect = function() {
  if (this.selected) {
    this.renderer.remove(this.container.ownerDocument.getElementById('tracker'));
    this.selected = null;
    this.onunselect(this);
  }
};


RichDrawEditor.prototype.getSelectedElement = function() {
  return this.selected;
};

RichDrawEditor.prototype.toCurve = function() {  
   this.renderer.tocurve();
}
RichDrawEditor.prototype.submitShape = function(data) {  
      
    if (this.mode != 'select') {   
        setMode('path', 'Path');  
        //this.unselect();  
                this.lineColor = frames['mondrianstyle'].strokehex;
                this.fillColor = frames['mondrianstyle'].fillhex;
                this.lineWidth = frames['mondrianstyle'].fillWidth; 
                this.lineOpac = frames['mondrianstyle'].strokeOpac;
                this.fillOpac = frames['mondrianstyle'].fillOpac;
                this.opac = frames['mondrianstyle'].fillOpac;    
         this.selected = this.renderer.datacreate(this.fillColor, this.lineColor, this.fillOpac, this.lineOpac, this.lineWidth, this.mouseDownX, this.mouseDownY, 1, 1,data);
         //if(!this.selected.id)
          //{
                 this.selected.id = 'shape:' + createUUID();
                 Ext.get(this.selected).on("mousedown", this.onHit,this);   
                 
                  setMode('select', 'Select'); 
                 // this.unselect();
                  //this.mode = 'select';
                  //this.selected= '';    
          //}
        
        //Ext.get(this.container).on( "mousemove", this.onDraw,this); 
         //setMode('path', 'Path');  

   }else{
                 
                 this.renderer.transformShape(this.selected,data,null); 
                this.renderer.remove(this.container.ownerDocument.getElementById('tracker')); 
                 this.renderer.showTracker(this.selected,this.pathsEdit);
                 
   }
 
};

RichDrawEditor.prototype.setGrid = function(horizontal, vertical) {
  this.gridX = horizontal;
  this.gridY = vertical;
};


RichDrawEditor.prototype.editCommand = function(cmd, value)
{
  if (cmd == 'mode') {
    this.mode = value;
  }
  else if (this.selected == null) {  
        
    if (cmd == 'fillcolor') {
      this.fillColor = value;
    }
    else if (cmd == 'linecolor') {
      this.lineColor = value;
    }
    else if (cmd == 'linewidth') {
      this.lineWidth = parseInt(value) + 'px';
    } 
    else if (cmd == 'fillopacity') {
       
      this.fillOpac = parseInt(value);
    } 
    else if (cmd == 'lineopacity') {
      this.lineOpac = parseInt(value);
    }
  }
  else {
    this.renderer.editCommand(this.selected, cmd, value);
  }
}


RichDrawEditor.prototype.queryCommand = function(cmd)
{
  if (cmd == 'mode') {
    return this.mode;
  }
  else if (this.selected == null) {
    if (cmd == 'fillcolor') {
      return this.fillColor;
    }
    else if (cmd == 'linecolor') {
      return this.lineColor;
    }
    else if (cmd == 'linewidth') {
      return this.lineWidth;
    }
    else if (cmd == 'fillopacity') {
     return  this.fillOpac;
    }
    else if (cmd == 'lineopacity') {
     return  this.fillOpac;
    }

  }
  else {
    return this.renderer.queryCommand(this.selected, cmd);
  }
}


RichDrawEditor.prototype.onSelectStart = function(event) {
  return false
}


RichDrawEditor.prototype.onKeyPress =  function(event){
 //alert('Character was ')
 //Ext.get(this.container).on( "keypress", function(event){
	var code;

	if (!event){ var event = window.event;}
	if (event.keyCode){ code = event.keyCode;}
	else if (event.which){ code = event.which;} 
	
	var pressedKey = String.fromCharCode(code);//.toLowerCase();
            //UNDO
	   if(event.ctrlKey && pressedKey == "z" || event.ctrlKey && pressedKey == "Z" )
            {
		this.clipboard=this.renderer.undo();
	     	//this.deleteSelection();
	    }

	if (this.mode == 'select') 
         {
	   //DELETE
	   if(code==46)
            {
	     	this.deleteSelection();
		
            }   
	   //CUT
	   if(event.ctrlKey && pressedKey == "x" || event.ctrlKey && pressedKey == "X" )
            {
		this.clipboard=this.renderer.copy(this.selected);
	     	this.deleteSelection();
	    }
	   //COPY
	   if (event.ctrlKey && pressedKey == "c" || event.ctrlKey && pressedKey == "C")
	    { 
			 this.clipboard=this.renderer.copy(this.selected);
	    }
	   //PASTE
       	   if (event.ctrlKey && pressedKey == "v" || event.ctrlKey && pressedKey == "V")
	    { 
			 //this.unselect();
			 this.selected=this.renderer.paste(this.clipboard,this.mouseDownX,this.mouseDownY);
			 this.selected.id = 'shape:' + createUUID();
 			Ext.get(this.selected).on( "mousedown", this.onHit,this);  
	    }
	    //DUPLICATE
       	   if (event.ctrlKey && pressedKey == "d" || event.ctrlKey && pressedKey == "D" )
	    { 
			 this.selected=this.renderer.duplicate(this.selected);
			 this.selected.id = 'shape:' + createUUID();
    			Ext.get(this.selected).on( "mousedown", this.onHit,this);  
	    }   
	    //LEFT
           if (event.ctrlKey && code==37)
            {
                //alert('left');  
               if(this.pathsEdit==true)
                {
                  var newx=parseFloat($('option_path_x').value)-1;    
                  var newy=parseFloat($('option_path_y').value); 
                  this.renderer.nodeMove(newx,newy);
                }
            }
            //UP
           if (code==38)
            {
                //alert('up');
               if(this.pathsEdit==true)
                {
                  var newx=parseFloat($('option_path_x').value);    
                  var newy=parseFloat($('option_path_y').value)-1; 
                  this.renderer.nodeMove(newx,newy);
                
                }
            }
            //RIGHT
            if (code==39)
             {
                //alert('right');
               if(this.pathsEdit==true) 
                {
                  var newx=parseFloat($('option_path_x').value)+1;    
                  var newy=parseFloat($('option_path_y').value); 
                  this.renderer.nodeMove(newx,newy);
                }
             }
            //DOWN
           if (code==40)
            {
                //alert('down')
               if(this.pathsEdit==true)
                {
                  var newx=parseFloat($('option_path_x').value);    
                  var newy=parseFloat($('option_path_y').value)+1; 
                  this.renderer.nodeMove(newx,newy);
                
                }
            }


	 }else{
			//alert('Character was ' +event.ctrlKey+' '+ code);
		if (event.ctrlKey && pressedKey == "x" ) 
		 {

			var cad;
		//for (i=0; i<this.length; i++){
			//cad+=this.renderer.child(i)+' ';//item
			//cad+=this.svgRoot.childNodes.length;
	 	//}
		    //this.deleteSelection();
			//alert(cad+'');
			//alert('Character was ' +event.ctrlKey+' '+ code);
		 }
  	 }
	//var character = String.fromCharCode(code);
	//alert('Character was ' + character);
  //});
 
  return false;
};

 /*

Event.observe(window, 'load', function() {
Event.observe(document, 'keypress', function(e){
var code;
if (!e) var e = window.event;
if (e.keyCode) code = e.keyCode;
else if (e.which) code = e.which;
var character = String.fromCharCode(code);
alert('Character was ' + character);
});
});
*/








RichDrawEditor.prototype.onMouseDown = function(event) {  
 
  //++ ???
  clockdata();
  
  ////////////
      
  
 if (this.mode != 'select') 
  {      
            
      var modeUsed=0;     
   if(this.mode == 'zoom') 
     {     
         var offset = Ext.get(this.container).getXY();
          var snappedX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
          var snappedY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;
          var widths=document.forms[0].gridwidth; 
          var width = parseFloat(widths.options[widths.selectedIndex].value);   
          contmove=0;
          this.setGrid(width, width);  
 
           this.unselect(); 
            xpArray=new Array();
            ypArray=new Array();
        
            this.mouseDownX = snappedX;
            this.mouseDownY = snappedY;   
            
             xpArray.push(this.mouseDownX);
             ypArray.push(this.mouseDownY);
         
        this.renderer.zoom(this.mouseDownX, this.mouseDownY);  
         modeUsed=1; 
     } //end zoom     


   if(this.mode == 'controlpath') 
     {            
                this.lineColor = frames['mondrianstyle'].strokehex;
                this.fillColor = frames['mondrianstyle'].fillhex;
                this.lineWidth = frames['mondrianstyle'].fillWidth; 
                this.lineOpac = frames['mondrianstyle'].strokeOpac;
                this.fillOpac = frames['mondrianstyle'].fillOpac;
          
          if(numClics<=0){     
                
              //if(this.nowDraw==true){ alert('Double click, please');this.onEndLineListener(event);  return true;}     
                  this.nowDraw=true;
                   setPoints=new Array();    
                   var offset = Ext.get(this.container).getXY();
                  var snappedX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
                  var snappedY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;
                  var widths=document.forms[0].gridwidth; 
                  var width = parseFloat(widths.options[widths.selectedIndex].value);   
                  contmove=0;
                  this.setGrid(width, width);  
                 
                   this.unselect(); 
                    xpArray=new Array();
                    ypArray=new Array();
                
                    this.mouseDownX = snappedX;
                    this.mouseDownY = snappedY;   
                    
                     xpArray.push(this.mouseDownX);
                     ypArray.push(this.mouseDownY);
                      setPoints.push(this.mouseDownX+','+this.mouseDownY); 
                     
                    this.selected = this.renderer.create(this.mode, this.fillColor, this.lineColor, this.fillOpac, this.lineOpac, this.lineWidth, this.mouseDownX, this.mouseDownY, 1, 1);
                     //document.forms[0].code.value=numClics;    
                     this.selected.id = 'shape:' + createUUID(); 
                     Ext.get(this.selected).on( "mousedown", this.onHit,this);  
                     
                    document.forms[0].code.value=this.selected.id+' ';   
                    //-- this.selected.id = this.mode+':' + createUUID();
                    
                   Ext.get(this.selected).on( "dblclick", this.onEndLine,this);  
                   // Ext.get(this.container).on( "mouseout", this.onMouseUp,this);  
                     Ext.get(this.container).on( "mousemove", this.onDraw,this); 
                     numClics++;
           }else{  
                var coord=this.inputxy;
	        var X=parseFloat(coord[0]);
	        var Y=parseFloat(coord[1]); 
               // document.forms[0].code.value=''+X+','+Y;  
                setPoints.push(X+','+Y);
              //document.forms[0].code.value=numClics;   
             this.renderer.clic(this.selected);
              numClics++;
             }
         
        modeUsed=1; 
     } //end  
     
    if(modeUsed == 0) 
     {   
           
         var offset = Ext.get(this.container).getXY();
          var snappedX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
          var snappedY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;
          var width = this.gridWidth;
          contmove=0;
          this.setGrid(width, width);  
 
           this.unselect(); 
            xpArray=new Array();
            ypArray=new Array();
        
            this.mouseDownX = snappedX;
            this.mouseDownY = snappedY;   
            
             xpArray.push(this.mouseDownX);
             ypArray.push(this.mouseDownY);
 
        
          this.unselect();   
          /*
                this.lineColor = frames['mondrianstyle'].strokehex;
                this.fillColor = frames['mondrianstyle'].fillhex;
                this.lineWidth = frames['mondrianstyle'].fillWidth; 
                this.lineOpac = frames['mondrianstyle'].strokeOpac;
                this.fillOpac = frames['mondrianstyle'].fillOpac;
*/
            this.selected = this.renderer.create(this.mode, this.fillColor, this.lineColor, this.fillOpac, this.lineOpac, this.lineWidth, this.mouseDownX, this.mouseDownY, 1, 1);
            
             this.selected.id = 'shape:' + createUUID();   
            
            //-- this.selected.id = this.mode+':' + createUUID();
           Ext.get(this.selected).on( "mousedown", this.onHit,this);  
            Ext.get(this.container).on( "mousemove", this.onDraw,this);  
            //Ext.get(this.container).on( "mouseover", this.onTranslate,this);  
            //Ext.get(this.container).on( "mouseout", this.onRotate,this); 
           
     }     
           
  }
    else   // Mode is select
  {  
        
           
        // if(this.nowDraw==true){ alert('Double click, please'); this.onEndLineListener(event); return true;}
       //Ext.get(this.container).on( "mouseout", this.onRotate,this);  
             this.previusBox=this.selected;  
            
       
	
        
       if (this.mouseDownX != snappedX || this.mouseDownY != snappedY)
       {  
          if(typeTransform=='Translate')
           {  
             
	     inout='move';//true;   
	     //Event.observe(this.selected, "mousedown", this.onHit,this);  
             //Ext.get(this.container).on( "mousemove", this.onDrag,this);  

           }
          if(typeTransform=='Scale'  || typeTransform=='Rotate') {
              
             inout='rotate_escale';//false          
            Ext.get(this.selected).on( "mousedown", this.onHit,this);  
             Ext.get(this.container).on( "mousemove", this.onDrag,this);  
             //Ext.get(this.container).on( "mouseover", this.onTranslate,this);  
             //Ext.get(this.container).on( "mouseout", this.onRotate,this); 
              //this.unselect();   
           }  
         
         if(typeTransform==''){
             this.unselect();        
         }  
       } 
        else
       { 
           //alert(',,');
           this.renderer.info(this.selected);  
          
                 
           
       } // end mousedown    
       
   } //end mode select
                  
  return false;
};












RichDrawEditor.prototype.onMouseUp = function(event) {
 
 //Ext.get(this.selected).un("mousemove",this.onDrag)
 
	
  if (this.mode != 'select') 
   {  
       //this.renderer.restruct(this.selected);
       
    if(this.mode == 'controlpath') 
     {
         //Event.observe(this.selected, "mousemove", this.onClic,this);  
         

         //this.renderer.info(this.selected);
         
         
     }
      else
     {  
          Ext.get(this.container).un("mousemove", this.onDraw);  
 
           this.selected = null;   
     }
        
   } else
   {      
      
Ext.get(this.container).un("mousemove", this.onDraw);  
  
     // if(inout=='move' || inout=='rotate_scale' ){
     if(typeTransform=="Rotate" || typeTransform=="Scale" ) 
      {         
         //inout='move';//true;
         Ext.get(this.container).un("mousemove", this.onDrag);  
        //this.renderer.restruct(this.selected);
        contmove=0; 
      } 
      if(typeTransform=="Translate" ) 
      {  
         Ext.get(this.container).un("mousemove", this.onDrag);  
        //this.renderer.restruct(this.selected);
        contmove=0; 

      }
      if(inout=='multiSelect'){
            //this.unselect(); 
             //inout='move';//true;      
        } 
      typeTransform==''; 
   }  
   
   //Event.stopObserving(this.container, "mousemove", this.onDraw,this);  
};





RichDrawEditor.prototype.onDrag = function(event) {  

  
  var offset = Ext.get(this.container).getXY();
  var snappedX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
  var snappedY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;

  var deltaX = snappedX - this.mouseDownX;
  var deltaY = snappedY - this.mouseDownY; 

  var modeUsed=0;              
  if(this.mode == 'zoom') 
   {  
       //this.renderer.zoom(this.selectedBounds.x + deltaX, this.selectedBounds.y + deltaY); 
      // this.renderer.zoom(this.mouseDownX, this.mouseDownY);  
 
          modeUsed=1; 
   }
  if(this.mode == 'controlpath') 
     {  
      modeUsed=1; 
     }
  if(modeUsed==0)
   {        
           if(inout=='multiSelect'){ 
               this.renderer.showMultiSelect(this.mouseDownX, this.mouseDownY);  
           }
       
       
           if(typeTransform=="Translate")
            {      
                 var coord=this.inputxy;
	   var moveX=parseFloat(coord[0]);
	   var moveY=parseFloat(coord[1]); 
 
               this.renderer.move(this.selected, this.selectedBounds.x + deltaX, this.selectedBounds.y +deltaY,this.clicX,this.clicY);
               //this.renderer.move(this.selected,  this.mouseDownX,  this.mouseDownY,this.clicX,this.clicY);
              //  this.renderer.move(this.selected, moveX, moveY,this.clicX,this.clicY);
               this.renderer.showTracker(this.selected,this.pathsEdit); 
               
            }  
           //if(inout=='rotate_scale'){ 
                      
               if(typeTransform=="Rotate") 
                 { 
                   this.renderer.rotateShape(this.selected, this.previusBox,deltaX, deltaY);
                   this.renderer.showTracker(this.selected,this.pathsEdit);
                 }

              	//if(typeTransform=="Scale") {this.renderer.scale(this.selected, this.previusBox, deltaX, deltaY); }
          	if(typeTransform=="Scale") 
          	 {
          	      this.renderer.scaleShape(this.selected, this.previusBox, this.selectedBounds.x + deltaX, this.selectedBounds.y + deltaY); 
          	      this.renderer.showTracker(this.selected,this.pathsEdit);
          	 }
          	//if(typeTransform=="Scale") {this.renderer.scale(this.selected, this.previusBox, this.selectedBounds.width + deltaX, this.selectedBounds.height + deltaY); }
          	
          	//RichDrawEditor.prototype.onTransform(event);
          	
             
           //} 
        
    }   
 // Update selection tracker
 //this.renderer.remove(this.container.ownerDocument.getElementById('tracker'));
  
  //this.renderer.remove(this.container.ownerDocument.getElementById('tracker'));

// hide_tracker();
};


RichDrawEditor.prototype.onResize = function(event) {
  var offset = Ext.get(this.container).getXY();
  var snappedX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
  var snappedY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;

  var deltaX = snappedX - this.mouseDownX;
  var deltaY = snappedY - this.mouseDownY;

  this.renderer.track(handle, deltaX, deltaY);

  // Update selection tracker
  show_tracker();
//  hide_tracker();
};


RichDrawEditor.prototype.onDraw = function(event) {
  if (this.selected == null)
   {
       return;
   }else{
        var offset = Ext.get(this.container).getXY()
        var snappedX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
        var snappedY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;
        this.renderer.resize(this.selected, this.mouseDownX, this.mouseDownY, snappedX, snappedY);
  }
};

RichDrawEditor.prototype.onRotate = function(event) {
  if (this.selected == null)
   {
     
   }else{      
         document.getElementById('richdraw').style.cursor='e-resize';
         //alert('chao');
         //inout=false; 
          
        //return;
   }
};

RichDrawEditor.prototype.onScale = function(event) {
  if (this.selected == null)
   {
     
   }else{      
         //document.getElementById('richdraw').style.cursor='e-resize';
         //alert('chao');
         //inout=false; 
          
        //return;
   }
};

RichDrawEditor.prototype.onTransform = function(event) {
  if (this.selected == null)
   {
     
   }else{  
     	//if(typeTransform=="rotate") {this.renderer.rotate(this.selected, this.selectedBounds.x + deltaX, this.selectedBounds.y + deltaY);}
  	//if(typeTransform=="scale") {this.renderer.scale(this.selected, this.selectedBounds.x + deltaX, this.selectedBounds.y + deltaY); }
  
  }
};

RichDrawEditor.prototype.onTranslate = function(event) {
  if (this.selected == null)
   {
    
   }else{  
      // document.getElementById('richdraw').style.cursor='move';
        //alert('hello');
         //inout=true;    
      
        //return;
   } 
   var offset = Ext.get(this.container).getXY()
          // var offset = Ext.get(this.container).getXY();
        var x = Math.round(event.getXY()[0] - offset[0]);
        var y = Math.round(event.getXY()[1] - offset[1]);

   //var x= parseFloat(event.getXY()[0]); 
   //var y= parseFloat(event.getXY()[1]);
   this.inputxy = [x,y]
   this.onInputXY(x,y);
};                                       


RichDrawEditor.prototype.onHit = function(event) {
//console.log("AAH HIT!!!!")
 if(this.mode == 'select') 
  { 
   if(inout=='multiSelect')
    {   
      //Ext.get(this.container).on( "mousemove", this.onDrag,this);   
      //Ext.get(this.container).on( "mouseup", this.onMouseUp,this);   
 
    }
     else
    { 
     typeTransform="Translate"   
    
    /* //this.previusBox=this.selected;      
     this.select(Event.element(event));
     this.selectedBounds = this.renderer.bounds(this.selected);
     //document.forms[0].code.value=shape(c,this.selected);
     var offset = Ext.get(this.container).getXY();
     this.mouseDownX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
     this.mouseDownY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;
     this.renderer.info(this.selected);
     Ext.get(this.container).on( "mousemove", this.onDrag,this);    
     //Ext.get(this.container).on( "mouseover", noselect);  
     Ext.get(this.container).on( "mouseout", this.onMouseUp,this); 
     //Ext.get(this.container).on( "mouseup", this.onMouseUp,this); 
     //typeTransform=="Translate";  
     //if(typeTransform=="Rotate") {this.renderer.rotate(this.selected, this.previusBox,2, 2);}
    */
        //var width = parseFloat(widths.options[widths.selectedIndex].value);   
       
     contmove=0;
     //this.setGrid(this.lineWidth, width);  
    var width = this.gridWidth;
    
          this.setGrid(width, width);  
     
    this.select(event.getTarget());
    this.selectedBounds = this.renderer.bounds(this.selected);
    //document.forms[0].code.value=shape(c,this.selected);
    var offset = Ext.get(this.container).getXY(); 
    
    this.mouseDownX = Math.round((event.getXY()[0] - offset[0]) / this.gridX) * this.gridX;
    this.mouseDownY = Math.round((event.getXY()[1] - offset[1]) / this.gridY) * this.gridY;
    this.renderer.info(this.selected);
    Ext.get(this.container).on( "mousemove", this.onDrag,this);   

     //Ext.get(this.container).on( "mouseout", this.onDrag,this); 
    }
  }
   else
  {
       
  }
};
RichDrawEditor.prototype.onClic = function(event) {
 if(this.mode == 'controlpath') 
  { 
     
    //Ext.get(this.container).on( "mouseout", this.onMouseUp,this);     
  
    //Ext.get(this.container).on( "mousemove", this.onDrag,this);   

     //Ext.get(this.container).on( "mouseout", this.onDrag,this); 
  }
   else
  {
       
  }
};    


RichDrawEditor.prototype.onEndLine = function(event) {   
  
 if(this.mode == 'controlpath') 
  {      // alert('hello');   
        numClics=0;
         //this.selected = null; 

         //Event.stopObserving(this.container, "mousemove", this.onDraw,this); 
            
            

            //Event.observe(this.selected, "mousedown", this.onHit,this);  
            //Ext.get(this.container).on( "mousemove", this.onDraw,this);  
          
            //Event.stopObserving(this.selected, "dblclick", this.onEndLine,this);
            //Event.stopObserving(this.container, "mousemove", this.onDraw,this);  
 
          this.selected = null;   


         //this.unselect(); 
         
  }
   else
  {
  this.nowDraw=false;     
  }
};
function noselect(){
    //typeTransform="";    
}

function createUUID()
{
  return [4, 2, 2, 2, 6].map(function(length) {
    var uuidpart = "";
    for (var i=0; i<length; i++) {
      var uuidchar = parseInt((Math.random() * 256)).toString(16);
      if (uuidchar.length == 1)
        uuidchar = "0" + uuidchar;
      uuidpart += uuidchar;
    }
    return uuidpart;
  }).join('-');
}


//----------------------------------------------------------------------------
// AbstractRenderer
//
// Abstract base class defining the drawing API. Can not be used directly.
//----------------------------------------------------------------------------

function AbstractRenderer() {

};

AbstractRenderer.prototype.init = function(elem) {};
AbstractRenderer.prototype.bounds = function(shape) { return { x:0, y:0, width:0, height: 0 }; };
AbstractRenderer.prototype.create = function(shape, fillColor, lineColor, lineWidth, left, top, width, height) {};
AbstractRenderer.prototype.datacreate = function(fillColor, lineColor, lineWidth, fillOpac, strokeOpac, left, top, width, height,data) {};
AbstractRenderer.prototype.index = function(shape, order) {};
AbstractRenderer.prototype.remove = function(shape) {}; 
AbstractRenderer.prototype.copy = function(shape) {};
AbstractRenderer.prototype.paste = function(left,top) {};
AbstractRenderer.prototype.duplicate = function(shape) {};
AbstractRenderer.prototype.move = function(shape, left, top) {};  
AbstractRenderer.prototype.endmove = function(shape) {};
AbstractRenderer.prototype.transform= function(shape, left, top) {};
AbstractRenderer.prototype.scale = function(shape, left, top) {};
AbstractRenderer.prototype.rotate = function(shape, left, top) {};
AbstractRenderer.prototype.track = function(shape) {}; 
AbstractRenderer.prototype.restruct = function(shape) {};
AbstractRenderer.prototype.resize = function(shape, fromX, fromY, toX, toY) {};
AbstractRenderer.prototype.editCommand = function(shape, cmd, value) {};
AbstractRenderer.prototype.queryCommand = function(shape, cmd) {};
AbstractRenderer.prototype.showTracker = function(shape,value) {};
AbstractRenderer.prototype.getMarkup = function() { return null; };
AbstractRenderer.prototype.info = function(shape){}; 
AbstractRenderer.prototype.editShape = function(shape,data){};
AbstractRenderer.prototype.onKeyPress = function(){};


//-----------------------------
// Geometry
//-----------------------------   

//two point angle  deg
function ang2v(x1,y1,x2,y2)
{
     /*
      var k=0;

      var sum1=u1+v1; 
      var sum2=u2+v2;    

      var res1=u1-v1;  
      var res2=u2-v2;   

     var ku1=k*u1; 
      var ku2=k*u2;   

       var mu= Math.sqrt(u1*u1+u2*u2); 
       var mv= Math.sqrt(v1*v1+v2*v2);

       var pesc= u1*v1+u2*v2; 
       //var ang=Math.acos(pesc/(mu*mv))*180/Math.PI;
       var ang=Math.acos(pesc/(mu*mv));  
       */ 
        var resx=x2-x1;  
      var resy=y2-y1;   
       var ang=Math.atan2(resy,resx); 
       //alert(ang);
       return ang;
}     

function dist2p(a,b,c,d) 
 {
   with (Math) 
    {
        //var d2p=sqrt(abs(((d-b)*(d-b) )+((c-a)*(c-a))));   //decimas(d2p,3);     return d2p;
          return sqrt(abs((d-b)*(d-b)+ (c-a)*(c-a)));

    }
 }
function pmd2pb(a,b,c,d,q) {
	pmdx= (1-q)*a+c*q;
	pmdy= (1-q)*b+d*q;
//pmdx=decimas(pmdx,3);
//pmdy=decimas(pmdy,3);
var cad=pmdx+','+pmdy;
var sol= new Array();
sol= [cad,pmdx,pmdy];
return sol

} 

function getAngle(dx,dy) {
  var angle = Math.atan2(dy, dx);
  //angle *= 180 / Math.PI;
  return angle;  
  
}

/*

A = y2-y1
B = x1-x2
C = A*x1+B*y1
Regardless of how the lines are specified, you should be able to generate two different points along the line, and then generate A, B and C. Now, lets say that you have lines, given by the equations:
A1x + B1y = C1
A2x + B2y = C2
To find the point at which the two lines intersect, we simply need to solve the two equations for the two unknowns, x and y.

    double det = A1*B2 - A2*B1
    if(det == 0){
        //Lines are parallel
    }else{
        double x = (B2*C1 - B1*C2)/det
        double y = (A1*C2 - A2*C1)/det
    }




*/  
// interseccion 2 rectas
function ntrsccn2rb(a,b,c,d,e,f,g,h){
 var solution= new Array();
 var i2rx=0;var i2ry=0;
 var w= (c-a)*(f-h)-(e-g)*(d-b);
 if(w==0){
  n=1;
  i2rx= (1-n)*a+n*c;
  i2ry= (1-n)*b+n*d;
  solution= ['',i2rx,i2ry];  
  //Lines are parallel
  return solution
  //return (i2rx+' '+i2ry);
 }
 var n = (((e-a)*(f-h))-((e-g)*(f-b)))/w;
 i2rx=(1-n)*a+n*c;
 i2ry=(1-n)*b+n*d;
 //return (i2rx+' '+i2ry);
 solution= ['',i2rx,i2ry];
 return solution

}

//ecuacion implicita de la recta
function ccnmplct(a,b,c,d) { 
  var solution= new Array();
  //a1 a2, b1 b2    vector direccion b1-a1 , b2-a2
  var v1m=c-a;
  var v1n=d-b;
  var c1x= v1m;
  var c1y= v1n;
  // ecuacion continua (x - a) /c -a =  (y - b)/d - b
  //(x - a) * v1n =  (y - b) * v1m 
  //x * v1n - v1n*a = y * v1m - b* v1m
  eia= v1n ;
  eib= - v1m;
  eic=  (b* v1m) - ( v1n*a)
  solution= [eia,eib,eic];
  return solution
}
 //JS File: ../js/drawing/wrapper.js 
 /**
* Heh. This file provides wrappers for OnlyPaths. really quite simple really
* donno if i'll even use this. it'll probably be filled with hacks and other crap
* and there'll be probably more globals declared here than anywhere else... combined
*/
function $(e){
return document.getElementById(e);
}

clockdata = function(){};

  var c, browser, browserpath; 
  var canvasWidth=480;
  var canvasHeight=272; 
  
  var zoominit='0 0 '+canvasWidth+' '+canvasHeight;
  var centerZoomx=Math.round(canvasWidth/2);
  var centerZoomy=Math.round(canvasHeight/2);
  var selectmode='';
  var selectedit='';
Ax.preinit = function(){
var fx = (new Ext.Window({title: "hacks to get onlypaths happy", html: "Please wait, i'll disappear soon!<br>"+Ax.hackcode}))
fx.show(document.body)
fx.hide()
}

Ax.drawinit = function(){
$("drawcanvas").innerHTML = "";
Ax.msg("W00t!","you enabled the drawing component: OnlyPaths!!!! NOw you can start drawing and doing stuff that actually matters");
Ax.canvas = new RichDrawEditor($("drawcanvas"), new SVGRenderer());
Ax.canvas.onInputXY = Ax.setDrawXY;
Ax.Color.update = Ax.updatecolors;
Ax.updatecolors();

Ax.setTool('rect');
}

Ax.updatecolors = function(){
  Ax.canvas.editCommand('fillcolor', '#'+Ax.Color.fill);
  Ax.canvas.editCommand('linecolor', '#'+Ax.Color.line);
  Ax.canvas.editCommand('linewidth', Ax.Color.width.toString()+'px');   
}

Ax.setTool = function(tool){

Ax.canvas.editCommand('mode', tool);
}

Ax.hackcode = "<div id=\"datadiv\" style=\"font-size:10px;position:absolute;top:18px;left:0px;height:14px;width:700px; padding:1px; margin-top:1px; background-color:none;\"> <span id=\"status\" style=\"position:absolute;top:0px;left:5px;width:2px;\"> </span> <!-- --> <div id=\"options_text\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:90px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> <input name=\"option_text_message\" type=\"text\" size=\"22\" id=\"option_text_message\" value=\"My text\" onmouseover=\"this.focus()\" onKeyPress=\"return edit(this,event)\"> Size:<input type=\"text\" size=\"3\" id=\"option_text_size\" name=\"option_text_size\" value=\"30\" onKeyPress=\"return edit(this,event)\"> Family:<select id=\"select_option_text_family\" name=\"select_option_text_family\" onchange=\"setTextFamily(this);\" > <option style=\"font-family:Arial;\" value=\"Arial\">Arial</option> <option style=\"font-family:Verdana;\" value=\"Verdana\">Verdana</option> <option style=\"font-family:Times;\" value=\"Times\">Times</option> <option style=\"font-family:Times;\" value=\"Tahoma\">Tahoma</option> <option style=\"font-family:Times;\" value=\"Impact\">Impact</option> </select> <input type=\"hidden\" name=\"option_text_family\" id=\"option_text_family\" value=\"Arial\" > </div> <!--/ OPTIONS_TEXT --> <!-- OPTIONS_SELECT_PATH --> <div id=\"options_select_path\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:5px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> <input type=\"text\" name=\"codebase\" id=\"codebase\" style=\"height:15px;width:600px; padding:1px 1px 1px 4px; margin:0px; background-color:#ffffff;\" value=\"\"><img id=\"envshape\" style=\"background-color:orange;\" title=\"Submit Shape\" onclick=\"setShape();\" border=\"0px\" src=\"setpath1.gif\"> </div> <!--/ OPTIONS_SELECT_PATH --> <!-- OPTIONS_RECT --> <div id=\"options_rect\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:5px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> trX<input id=\"option_rect_trx\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> trY<input id=\"option_rect_try\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\"onKeyPress=\"return edit(this,event)\"> wx<input id=\"option_rect_sclx\" type=\"text\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> wy<input id=\"option_rect_scly\" type=\"text\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> rot<input id=\"option_rect_rot\" type=\"text\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> </div> <!--/ OPTIONS_RECT --> <!-- OPTIONS_IMAGE --> <div id=\"options_image\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:5px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> trX<input id=\"option_img_trx\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> trY<input id=\"option_img_try\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\"onKeyPress=\"return edit(this,event)\"> wx<input id=\"option_img_sclx\" type=\"text\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> wy<input id=\"option_img_scly\" type=\"text\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> rot<input id=\"option_img_rot\" type=\"text\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> Source: <input name=\"option_image_href\" type=\"text\" size=\"62\" id=\"option_image_href\" value=\"http://www.johnwaynebirthplace.org/centennial/images/brian_bausch1.jpg\" onmouseover=\"this.focus()\" onKeyPress=\"return edit(this,event)\"> </div> <!-- http://swiki.agro.uba.ar/small_land/uploads/205/smalllandmouse_transparent.gif --> <!--/ OPTIONS_IMAGE --> <!-- OPTIONS_PATH --> <div id=\"options_path\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:5px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> trX<input id=\"option_path_trx\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> trY<input id=\"option_path_try\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\"onKeyPress=\"return edit(this,event)\"> <input id=\"option_path_sclx\" type=\"hidden\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> <input id=\"option_path_scly\" type=\"hidden\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> rot<input id=\"option_path_rot\" type=\"text\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> Open/Close: <input CHECKED name=\"option_path_close\" id=\"option_path_close\" type=\"checkbox\"> <input type=\"text\" name=\"control_codebase\" id=\"control_codebase\" style=\"height:15px;width:300px; padding:1px 1px 1px 4px; margin:0px; background-color:#ffffff;\" onmouseover=\"this.focus()\" value=\"\" onKeyPress=\"return edit(this,event)\"> <img style=\"cursor:pointer\" align=\"top\" title=\"to curve\" onclick=\"c.renderer.tocurve();\" src=\"tocurve.gif\"> <input id=\"option_path_num\" type=\"hidden\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\"> Px<input id=\"option_path_x\" type=\"text\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\" onKeyPress=\"return editPath(this,event)\"> Py<input id=\"option_path_y\" type=\"text\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\" onKeyPress=\"return editPath(this,event)\"> </div> <!--/ OPTIONS_PATH --> <!-- <div id=\"options_controlpath\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:5px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> trX<input id=\"option_controlpath_trx\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> trY<input id=\"option_controlpath_try\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\"onKeyPress=\"return edit(this,event)\"> <input id=\"option_controlpath_sclx\" type=\"hidden\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> <input id=\"option_controlpath_scly\" type=\"hidden\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> rot<input id=\"option_controlpath_rot\" type=\"text\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> Open/Close: <input CHECKED name=\"option_controlpath_close\" id=\"option_controlpath_close\" type=\"checkbox\"> <input type=\"text\" name=\"control_codebase\" id=\"control_codebase\" style=\"height:15px;width:300px; padding:1px 1px 1px 4px; margin:0px; background-color:#ffffff;\" value=\"\"> </div> --> <div id=\"options_ellipse\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:5px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> trX<input id=\"option_ellipse_trx\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> trY<input id=\"option_ellipse_try\" type=\"text\" size=\"1\" style=\"background-color:#ffffdd\" value=\"0\"onKeyPress=\"return edit(this,event)\"> wx<input id=\"option_ellipse_sclx\" type=\"text\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> wy<input id=\"option_ellipse_scly\" type=\"text\" size=\"1\" style=\"background-color:#ddffdd\" value=\"1\" onKeyPress=\"return edit(this,event)\"> rot<input id=\"option_ellipse_rot\" type=\"text\" size=\"1\" style=\"background-color:#ffdddd\" value=\"0\" onKeyPress=\"return edit(this,event)\"> </div> <!--/ OPTIONS_ELLIPSE --> <div id=\"options_zoom\" style=\"font-size:9px;visibility:hidden;position:absolute;top:0px;left:5px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> <img id=\"zoom_more\" title=\"More zoom\" onclick=\"zoommode='more';info_zoom()\" src=\"zoom_more.gif\" > <img id=\"zoom_minus\" title=\"Minus zoom\" onclick=\"zoommode='minus';info_zoom()\" src=\"zoom_minus.gif\" > <img id=\"zoom_frame\" title=\"Frame zoom\" onclick=\"zoommode='frame';info_zoom()\" src=\"zoom_frame.gif\" > <img id=\"zoom_hand\" title=\"Hand zoom\" onclick=\"zoommode='hand';info_zoom()\" src=\"zoom_hand.gif\" > </div> <!--/ OPTIONS_ZOOM --> <div id=\"options_select\" style=\"font-size:9px;visibility:visible;position:absolute;top:0px;left:740px;height:14px;width:100%; padding:1px; margin-top:1px; background-color:none;\"> <img id=\"select_deleteone\" title=\"Delete one\" onclick=\"selectedit='deleteone';info_select()\" src=\"delete.gif\" > <img id=\"select_deleteall\" title=\"Delete all\" onclick=\"selectedit='deleteall';info_select()\" src=\"reset.gif\" > <img id=\"select_tothetop\" title=\"To the top\" onclick=\"selectedit='tothetop';info_select()\" src=\"tothetop.gif\" > <img id=\"select_totheback\" title=\"To the back\" onclick=\"selectedit='totheback';info_select()\" src=\"totheback.gif\" > <img id=\"select_onetop\" title=\"One top\" onclick=\"selectedit='onetop';info_select()\" src=\"onetop.gif\" > <img id=\"select_oneback\" title=\"One back\" onclick=\"selectedit='oneback';info_select()\" src=\"oneback.gif\" > </div> <!--/ OPTIONS_SELECT --> </div> <!--/ DATADIV -->";
 //JS File: ../js/drawing/svgrenderer.js 
 /*----------------------------------------------------------------------------
 SVGRENDERER 1.0
 SVG Renderer For RichDraw
 -----------------------------------------------------------------------------
 Created by Mark Finkle (mark.finkle@gmail.com)
 Implementation of SVG based renderer.
 -----------------------------------------------------------------------------
 Copyright (c) 2006 Mark Finkle

 This program is  free software;  you can redistribute  it and/or  modify it
 under the terms of the MIT License.

 Permission  is hereby granted,  free of charge, to  any person  obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the  Software without restriction,  including without limitation
 the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 Software is  furnished  to do  so, subject  to  the  following  conditions:
 The above copyright notice and this  permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 DEALINGS IN THE SOFTWARE.
 -----------------------------------------------------------------------------
 Dependencies:
 History:
 2006-04-05 | Created
 --------------------------------------------------------------------------*/


function SVGRenderer() {
	this.base = AbstractRenderer;
	this.svgRoot = null;
}


SVGRenderer.prototype = new AbstractRenderer;


SVGRenderer.prototype.init = function(elem) {
  this.container = elem;

  this.container.style.MozUserSelect = 'none';
    
  var svgNamespace = 'http://www.w3.org/2000/svg'; 
  
  this.svgRoot = this.container.ownerDocument.createElementNS(svgNamespace, "svg");
  this.svgRoot.setAttributeNS(null,'viewBox', zoominit);

  this.container.appendChild(this.svgRoot);
}


SVGRenderer.prototype.bounds = function(shape) {
  var rect = new Object();
  var box = shape.getBBox();
  rect['x'] = box.x;
  rect['y'] = box.y;
  rect['width'] =  box.width-18;
  rect['height'] = box.height-18;
  return rect;
}


SVGRenderer.prototype.create = function(shape, fillColor, lineColor, fillOpac, lineOpac, lineWidth, left, top, width, height) {
  var svgNamespace = 'http://www.w3.org/2000/svg'; 
  var xlinkNS="http://www.w3.org/1999/xlink"; 
  var svg;  
  if (shape == 'rect') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'rect');
    svg.setAttributeNS(null, 'x', left + 'px');
    svg.setAttributeNS(null, 'y', top + 'px');
    svg.setAttributeNS(null, 'width', width + 'px');
    svg.setAttributeNS(null, 'height', height + 'px');  
    //svg.setAttributeNS(null,'transform', "translate(0,0)");
    //svg.setAttributeNS(null,'transform', "translate('+left+','+top+')");   
    svg.style.position = 'absolute';
  }
  else if (shape == 'ellipse') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'ellipse');
    svg.setAttributeNS(null, 'cx', (left + width / 2) + 'px');
    svg.setAttributeNS(null, 'cy', (top + height / 2) + 'px');
    svg.setAttributeNS(null, 'rx', (width / 2) + 'px');
    svg.setAttributeNS(null, 'ry', (height / 2) + 'px');   
   //svg.setAttributeNS(null,'transform', "translate('+left+','+top+')");  
    svg.style.position = 'absolute';
  }
  else if (shape == 'roundrect') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'rect');
    svg.setAttributeNS(null, 'x', left + 'px');
    svg.setAttributeNS(null, 'y', top + 'px');
    svg.setAttributeNS(null, 'rx', '20px');
    svg.setAttributeNS(null, 'ry', '20px');
    svg.setAttributeNS(null, 'width', width + 'px');
    svg.setAttributeNS(null, 'height', height + 'px');   
   //svg.setAttributeNS(null,'transform', "translate('+left+','+top+')");  
    svg.style.position = 'absolute';
  }
  else if (shape == 'line') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'line');
    svg.setAttributeNS(null, 'x1', left + 'px');
    svg.setAttributeNS(null, 'y1', top + 'px');
    svg.setAttributeNS(null, 'x2', left + width + 'px');
    svg.setAttributeNS(null, 'y2', top + height + 'px');  
    //svg.setAttributeNS(null,'transform', "translate('+left+','+top+')");  
    svg.style.position = 'absolute';
  } 
  else if (shape == 'polyline') {
    var xcenterpoly=xpArray;
    var ycenterpoly=ypArray;
    var thispath=''+xpArray[1]+','+ypArray[1];
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'polyline');  
    svg.setAttributeNS(null, 'points', thispath);
    svg.style.position = 'absolute';
  }
  else if (shape == 'path')
    {
    var k = (Math.sqrt(2)-1)*4/3;
    var circle="M 0,1 L 0.552,1 1,0.552  1,0  1,-0.552  0.552,-1 0,-1 -0.552,-1 -1,-0.552 -1,0  -1,0.552  -0.552,1  0,1z"  // 4th
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'path');   
    //svg.setAttributeNS(null, 'd', 'M '+thispath+' C'+thispath);
    svg.setAttributeNS(null, 'd', circle);  	
    svg.setAttributeNS(null,'transform', "translate(0,0)"); 
    svg.style.position = 'absolute';  
    } 
     else if (shape == 'controlpath')
    {
    var point='M '+left+','+top+' L '+(left+1)+','+(top+1)+'z'  // 4th
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'path');   
    //svg.setAttributeNS(null, 'd', 'M '+thispath+' C'+thispath);
    svg.setAttributeNS(null, 'd', point);  	
    svg.setAttributeNS(null,'transform', "translate(0,0)"); 
    svg.style.position = 'absolute';  
    } 
 else if (shape == 'text') {
    var data = this.container.ownerDocument.createTextNode(data_text_messaje);
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'text');
    svg.setAttributeNS(null, 'x', parseFloat(left) + 'px');
    svg.setAttributeNS(null, 'y', parseFloat(top) + 'px');
    svg.setAttributeNS(null, 'font-family', data_text_family );
    svg.setAttributeNS(null, 'font-size', parseFloat(data_text_size)); 
    svg.style.position = 'absolute';  
    svg.appendChild(data);   
 } 
 else if (shape == 'image') { 
    //svg = this.container.ownerDocument.createElementNS(svgNamespace, 'g');    
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'image');
    svg.setAttributeNS(xlinkNS,'href', data_image_href);
    svg.setAttributeNS(null, 'x', parseFloat(left) + 'px');
    svg.setAttributeNS(null, 'y', parseFloat(top) + 'px');
    svg.setAttributeNS(null, 'width', parseFloat(width) + 'px');
    svg.setAttributeNS(null, 'height', parseFloat(height) + 'px');  
   
    svg.setAttributeNS(null, 'opacity', parseFloat(fillOpac));
    //svg.style.fill = fillColor;  
    //svg.style.stroke = lineColor;  
    //svg.style.strokeWidth = lineWidth; 
    //svg.style.fillOpacity = fillOpac;
    //svg.style.strokOpacity = lineOpac;
         
    //svg.appendChild(img);   
   /* if (fillColor.length == 0){fillColor = 'none';}
    if (lineColor.length == 0){lineColor = 'none';}
    svg.style.fill = fillColor;  
    svg.style.stroke = lineColor;  
    svg.style.strokeWidth = lineWidth; 
    svg.style.fillOpacity = fillOpac;
    svg.style.strokOpacity = lineOpac;
     svg.style.setAttributeNS(null, 'fill', fillColor);
          svg.style.setAttributeNS(null, 'stroke', lineColor);
          svg.style.setAttributeNS(null, 'stroke-width', lineWidth);
          svg.style.setAttributeNS(null, 'fill-opacity', fillOpac);  
          svg.style.setAttributeNS(null, 'stroke-opacity',lineOpac);
    
   */
 } 
 
 if(shape == 'zoom') 
  {
        
  }else
  {  
        if(shape != 'image')
         { 
                                                               
           //var set = this.container.ownerDocument.createElementNS(svgNamespace, "style");
            
           if (lineColor.length == 0){lineColor = 'none';} 
           if (fillColor.length == 0){fillColor = 'none';} 
          // set.setAttributeNS(null, 'stroke', lineColor);
          //set.setAttributeNS(null, 'stroke-width', lineWidth);
          //set.setAttributeNS(null, 'fill-opacity', fillOpac);  
          //set.setAttributeNS(null, 'stroke-opacity',lineOpac);
            //svg.appendChild(set);
           //svg.setAttributeNS(null, "style","fill:"+ fillColor+";stroke:"+lineColor+";strokeWidth:"+lineWidth+";fill-opacity:"+fillOpac+";stroke-opacity:"+lineOpac);  
           // 
          svg.setAttributeNS(null, 'fill', fillColor);
          svg.setAttributeNS(null, 'stroke', lineColor);
          svg.setAttributeNS(null, 'stroke-width', parseFloat(lineWidth));
          svg.setAttributeNS(null, 'fill-opacity', parseFloat(fillOpac));  
          svg.setAttributeNS(null, 'stroke-opacity',parseFloat(lineOpac));
                  
      
          /*     
          <a xlink:href="http://www.w3.org">
                <ellipse cx="2.5" cy="1.5" rx="2" ry="1"  fill="red" />
          </a>
          svg.style.stroke = lineColor;  
           svg.style.strokeWidth = lineWidth; 
           svg.style.fillOpacity = fillOpac;
           svg.style.strokOpacity = lineOpac;   
          if (fillColor.length == 0){fillColor = 'none';}
          
          if (lineColor.length == 0){lineColor = 'none';}
          */
         }
          this.svgRoot.appendChild(svg);
     
          return svg;        
   }        
  
};  

SVGRenderer.prototype.zoom = function(clicx,clicy){ 
/* 
function(direction, amount) { 
var viewBox = this.rootNode.getAttribute('viewBox');
    var viewVals = viewBox.split(' ');
    if (amount == null) {
        amount = SVGElement.panFactor;
    }
    switch (direction) {
        case 'left':
            amount = 0 - amount;
            // intentionally fall through
        case 'right':
            var currentPosition = parseFloat(viewVals[0]);
            currentPosition += amount;
            viewVals[0] = currentPosition;
            break;
        case 'up':
            amount = 0 - amount;
            // intentionally fall through
        case 'down':
            var currentPosition = parseFloat(viewVals[1]);
            currentPosition += amount;
            viewVals[1] = currentPosition;
            break;
        case 'origin':
            // reset everything to initial values
            viewVals[0] = 0;
            viewVals[1] = 0;
            this.rootNode.currentScale = 1;
            this.rootNode.currentTranslate.x = 0;
            this.rootNode.currentTranslate.y = 0;
            break;
    }
    this.rootNode.setAttribute('viewBox', viewVals.join(' '));        
 */
 
      
      
      //canvasWidth
      //canvasheight
   if(zoommode=='frame')
    {   
       var viewBox = this.svgRoot.getAttributeNS(null,'viewBox'); 
     
       //alert(viewBox);
      
       var viewBox = zoominit;  
       var viewVals = viewBox.split(' ');
       
       var corner1x = parseFloat(viewVals[0]); 
       var corner1y = parseFloat(viewVals[1]);  
       var corner2x = parseFloat(viewVals[2]); 
       var corner2y = parseFloat(viewVals[3]);  
    }
     else
    {   
       
       var viewBox = this.svgRoot.getAttributeNS(null,'viewBox'); 
      
       var viewVals = viewBox.split(' ');
       var prevCorner1x = parseFloat(viewVals[0]); 
       var prevCorner1y = parseFloat(viewVals[1]);  
       var prevCorner2x = parseFloat(viewVals[2]); 
       var prevCorner2y = parseFloat(viewVals[3]); 
       var prevWidth=prevCorner2x-prevCorner1x;  
       var prevHeight=prevCorner2y-prevCorner1y;   
        
    }
   
      if(zoommode=='more')
       {  
        var corner1x = prevCorner1x; 
        var corner1y = prevCorner1y;  
        var corner2x = prevCorner2x*0.95; 
        var corner2y = prevCorner2y*0.95;  
       }
      if(zoommode=='minus') 
       {
        var corner1x = prevCorner1x; 
        var corner1y = prevCorner1y;  
        var corner2x = prevCorner2x*1.05; 
        var corner2y = prevCorner2y*1.05;  
       }       
       var direction=0;
      if(zoommode=='hand') 
       {        
        var viewBox = zoominit;  
       var viewVals = viewBox.split(' ');
       
       
       var width = parseFloat(viewVals[2]); 
       var height = parseFloat(viewVals[3]); 
       
       var prevZoomCenterx=centerZoomx 
       var prevZoomCentery=centerZoomy 
       centerZoomx=clicx;
       centerZoomy=clicy; 
        direction=ang2v(prevZoomCenterx,prevZoomCentery,centerZoomx,centerZoomy);
       var distance=dist2p(prevZoomCenterx,prevZoomCentery,centerZoomx,centerZoomy);
       //alert(direction);  
       
       var corner1x = prevCorner1x+distance*Math.cos(direction+Math.PI); 
       var corner1y = prevCorner1y+distance*Math.sin(direction+Math.PI); 
       var corner2x = prevCorner2x+distance*Math.cos(direction+Math.PI); 
       var corner2y = prevCorner2y+distance*Math.sin(direction+Math.PI);   
       
       }
       direction=direction*180/Math.PI;
        //this.svgRoot.currentScale = zoomscale+0.1;
        //this.svgRoot.currentTranslate.x = 0;
        //this.svgRoot.currentTranslate.y = 0; 
        //var resultPosx=clicx-((prevscalex-posx)/2);//-Math.abs(posx+clicx)
        //var resultPosy=clicy-((prevscalex-posy)/2);//-Math.abs(posy+clicy)
        //var resultPosx=-Math.abs(posx+clicx);
        //var resultPosy=-Math.abs(posy+clicy);        

  this.svgRoot.setAttributeNS(null,'viewBox', (corner1x)+' '+(corner1y)+' '+corner2x+' '+corner2y+'');
  var viewBox = this.svgRoot.getAttributeNS(null,'viewBox'); 
  $('status').innerHTML=' '+viewBox; 
  //alert(direction+'__'+prevZoomCenterx+' '+prevZoomCentery+' '+centerZoomx+' '+centerZoomy);
}
SVGRenderer.prototype.datacreate = function(fillColor, lineColor, fillOpac, lineOpac, lineWidth, left, top, width, height,data) {
  var svgNamespace = 'http://www.w3.org/2000/svg';
  var svg;
  svg = this.container.ownerDocument.createElementNS(svgNamespace, 'path');   
  svg.setAttributeNS(null, 'd', data);  	
  svg.setAttributeNS(null,'transform', "translate(0,0)"); 
  svg.style.position = 'absolute';  
  if (fillColor.length == 0){fillColor = 'none';}
  svg.setAttributeNS(null, 'fill', fillColor);
  if (lineColor.length == 0){lineColor = 'none';}
  svg.setAttributeNS(null, 'stroke', lineColor);
  svg.setAttributeNS(null, 'stroke-width', lineWidth); 
  this.svgRoot.appendChild(svg);
  return svg;
};

SVGRenderer.prototype.index = function(shape,order) {  
 
     if(order==-1)
      {
        this.svgRoot.appendChild( shape );
      }
      if(order==0){
     
         this.svgRoot.insertBefore( shape, shape.parentNode.firstChild );
      } 
 
   if(order==1 || order==2)
    {
         var id=shape.getAttributeNS(null, 'id');
        //alert(id);
        
        
        var numNodes=this.svgRoot.childNodes.length;
        //alert(numNodes);
          
        var num=0;
        for(var i = 1; i < numNodes; i++)
         {                                                   
           
           var etiq=this.svgRoot.childNodes[i].getAttributeNS(null, 'id');
           if (etiq==id)
            { 
                num=i; 
               
            }                                                    
          } 
          //alert(num);    
          if(order==1) 
           {   
              if((num-1)>=-1)
               {  
                this.svgRoot.insertBefore( shape, this.svgRoot.childNodes[num-1]);
               } 
           }
          if(order==2){ 
               if((num+1)<numNodes)
               {
                  this.svgRoot.insertBefore( shape, this.svgRoot.childNodes[num+2]);
               }
          } 
          
    } 
    
    
   /*var contshapes =  shape.parentNode.childNodes.length;       
   var elem1 = shape;//this.svgRoot.childNodes[1]; 
   var elem2 = shape.parentNode.childNodes[parseInt(contshapes-9)];
    var tmp = elem1.cloneNode( true );
    shape.parentNode.replaceChild( tmp, elem2 );
    shape.parentNode.replaceChild( elem2, elem1 ); 
    */
    //alert(elem2+' '+ elem1 ) 
    //return  elem2;
    
}
SVGRenderer.prototype.remove = function(shape) {
  shape.parentNode.removeChild(shape);
}

SVGRenderer.prototype.removeAll = function() {  
 while( this.svgRoot.hasChildNodes () ){
   this.svgRoot.removeChild( this.svgRoot.firstChild );
 }
   /*var contshapes =  this.svgRoot.childNodes.length;       
    
                          
    var cad=contshapes+'   ';
    for(var i = 0; i < contshapes; i++)
    {                                  
        //alert(i); 
        //cad+=i+'_'+this.svgRoot.childNodes[i].tagName+' ';
        if(this.svgRoot.childNodes[i].id) {
             this.svgRoot.removeChild(this.svgRoot.childNodes[i]);
         }else{
            //cad+=i+'_'+this.svgRoot.childNodes[i].id+' ';
         }
    } 
    //alert(cad);  
*/ 
}

SVGRenderer.prototype.copy = function(shape) 
 {
   var svg;
   svg =shape.cloneNode(false); 
    
    //svg.setAttributeNS(null, 'fill', "#aa00aa");
   return svg;
 };


SVGRenderer.prototype.paste = function(clipboard,left,top) 
 {
   //var svg;
   //svg =shape;
   //clipboard.setAttributeNS(null, 'fill', "#0000aa");
   //clipboard.setAttributeNS(null,'transform', "translate("+left+","+top+")"); 
   this.svgRoot.appendChild(clipboard);
  return clipboard;
 };


SVGRenderer.prototype.duplicate = function(shape) 
 {
   var svg;
   svg =shape.cloneNode(false);
   svg.setAttributeNS(null, 'fill', "#aa00aa");
   this.svgRoot.appendChild(svg);
  return svg;
 };

SVGRenderer.prototype.undo = function() 
 {
  this.svgRoot.removeChild( this.svgRoot.lastChild );
 };
 
 /* 
 function zSwap(parent, elem1, elem2)
{
   var tmp = elem1.cloneNode( true );
   parent.replaceChild( tmp, elem2 );
   parent.replaceChild( elem2, elem1 );
}

SVGRenderer.prototype.moveToTop( svgNode )
{
   this.svgRoot.appendChild( svgNode );
}


SVGRenderer.prototype.moveToBottom( svgNode )
{
   this.svgRoot.insertBefore( svgNode, svgNode.parentNode.firstChild );
}

*/

     
var xshe=0; //bad
var yshe=0;  

SVGRenderer.prototype.move = function(shape, left, top,fromX,fromY) {  
 typeTransform='Translate';
 var box = shape.getBBox();
        contmove++;

  if (shape.tagName == 'rect'){
    shape.setAttributeNS(null, 'x', left);
    shape.setAttributeNS(null, 'y', top); 
    //$('option_rect_trx').value= left;  
    //$('option_rect_try').value= top;
  } 
  if (shape.tagName == 'image'){
    shape.setAttributeNS(null, 'x', left);
    shape.setAttributeNS(null, 'y', top);
    //$('option_img_trx').value= left;  
    //$('option_img_try').value= top;

  }
  if (shape.tagName == 'text'){
    shape.setAttributeNS(null, 'x', left);
    shape.setAttributeNS(null, 'y', top);
    //$('option_text_trx').value= left;  
    //$('option_text_try').value= top;

  }
  if (shape.tagName == 'line'){ 
    var deltaX = shape.getBBox().width;
    var deltaY = shape.getBBox().height;
    shape.setAttributeNS(null, 'x1', left);
    shape.setAttributeNS(null, 'y1', top);

    shape.setAttributeNS(null, 'x2', left + deltaX);
    shape.setAttributeNS(null, 'y2', top + deltaY);   
    //$('option_line_trx').value= left;  
    //$('option_line_try').value= top;

  }   
  if (shape.tagName == 'ellipse'){  
    var putx=left + (shape.getBBox().width / 2)    
    var puty= top + (shape.getBBox().height / 2)
    shape.setAttributeNS(null, 'cx', putx);
    shape.setAttributeNS(null, 'cy', puty);
    //$('option_ellipse_trx').value= putx;  
    //$('option_ellipse_try').value= puty;

  }
  if (shape.tagName == 'path' || shape.tagName == 'polyline' ) {

   if(contmove==1){ 
      xshe=left;
      yshe=top;  
    
         }    
//x=parseFloat(x);
//y=parseFloat(y); 
//var dist= dist2p(left,top,xshe,yshe) 

 
 //atanX = (left - xshe);
//atanY = (top - yshe);     
//dist = Math.sqrt(atanX * atanX + atanY * atanY);  // distance from start to finish
//var nX = atanX / dist;  // normalized x vector
//var nY = atanY / dist; 

//ang = Math.atan2(atanY, atanX);
/*
var dist= dist2p(left,top,xshe,yshe) 

var ang= ang2v(xshe,yshe,left,top) ;
var angle = Math.round((ang/Math.PI* 2)* 360);

var angx = Math.cos(ang); 
var angy = Math.sin(ang);  
*/ 

 var path=shape.getAttributeNS(null, 'd');
 path=path.replace(/, /g, ','); 
 path=path.replace(/ ,/g, ',');
 var ps =path.split(" ")
 var pcc = "";

var xinc=left-xshe;
var yinc=top-yshe;
   
    var re = /^[-]?\d*\.?\d*$/;
 for(var i = 0; i < ps.length; i++)
  { 
   if(ps[i].indexOf(',')>0){  
     
      var point =ps[i].split(","); 
       var char1=point[0].substring(0,1);
       point[1]= parseFloat(point[1]); 
       
       // var valnum =char1.charAt(0); 
       //if (isNaN(valnum))
       if (!char1.match(re)) 
        
       {
         var num0= parseFloat(point[0].substring(1));
         var text=char1;
       }else{
         var num0= parseFloat(point[0]);
         var text='';

       }
       //num0+=dist*angx;
       //point[1]+=dist*angy;
 
       num0+=xinc;
       point[1]+=yinc;
 
        var cx=num0;
        var cy=point[1]; 
        pcc+=text+cx+','+cy+' ';
   }else{
      pcc+=ps[i]+' ';
   }
  }
  
   // $('code').value=dist+' '+ ang+' '+'__'+x+'= '+left+'/ '+y+'= ' +top+'';
    
       //shape.setAttributeNS(null,'transform', "rotate("+left+")");
       
       // shape.setAttributeNS(null,'transform', "translate("+trax+","+tray+") rotate("+0+") scale(1,1)");
         shape.setAttributeNS(null,'d', pcc);

 }                                                                                                                            
                                                                                                                           
  
//$('status').innerHTML=typeTransform+': '+left+' '+top;
//$('option_select_trx').value= left;  
//$('option_select_try').value= top;
};



SVGRenderer.prototype.track = function(shape) {
  // TODO
};


SVGRenderer.prototype.clic = function(shape) {
         var end='';
	if(data_path_close==true){end='z';}
        var maxcont=setPoints.length;
        var thispath='M'+setPoints[0]+' ';  
        $('someinfo').value=maxcont;
      
        for(var conta=1;conta< maxcont;conta++){        
          thispath+='L'+setPoints[conta]+' ';
          
	
        }
              //var pointshape=shape.getAttributeNS(null,"d");
         	//shape.setAttributeNS(null,'d',thispath+end);
         	var path=thispath+end;
       
         	shape.setAttributeNS(null,'d',path);
                $('control_codebase').value=path;
 
}


SVGRenderer.prototype.resize = function(shape, fromX, fromY, toX, toY) {
   var deltaX = toX - fromX;
  var deltaY = toY - fromY;  
  
     /*      if (lineColor.length == 0){lineColor = 'none';} 
           if (fillColor.length == 0){fillColor = 'none';}
           shape.style.fill = fillColor;  
           shape.style.stroke = lineColor;  
           shape.style.strokeWidth = lineWidth; 
           shape.style.fillOpacity = fillOpac;
           shape.style.strokOpacity = lineOpac;        
      */     
    if (shape.tagName == 'rect' ) 
    {   
      if (deltaX < 0) {
         shape.setAttributeNS(null, 'x', toX + 'px');
         shape.setAttributeNS(null, 'width', -deltaX + 'px');
       }
        else
       {
         shape.setAttributeNS(null, 'width', deltaX + 'px');
       }
  
      if (deltaY < 0) 
       {
        shape.setAttributeNS(null, 'y', toY + 'px');
        shape.setAttributeNS(null, 'height', -deltaY + 'px');
       }
        else 
       {
        shape.setAttributeNS(null, 'height', deltaY + 'px');
       }
      /*shape.style.fill = fillColor;  
      shape.style.stroke = lineColor;  
      shape.style.strokeWidth = lineWidth; 
      shape.style.fillOpacity = fillOpac;
      shape.style.strokOpacity = lineOpac;         
      */
    }
    
    if ( shape.tagName == 'image' ) 
    {   
        //var img=shape.firstChild;//nodeName;//nodeValue;//nodes.item(0);
        //alert(img);
      if (deltaX < 0) {
         shape.setAttributeNS(null, 'x', parseFloat(toX) + 'px');
         shape.setAttributeNS(null, 'width', parseFloat(-deltaX) + 'px');
       }
        else
       {
         shape.setAttributeNS(null, 'width', parseFloat(deltaX) + 'px');
       }
  
      if (deltaY < 0) 
       {
        shape.setAttributeNS(null, 'y', parseFloat(toY) + 'px');
        shape.setAttributeNS(null, 'height', parseFloat(-deltaY) + 'px');
       }
        else 
       {
        shape.setAttributeNS(null, 'height', parseFloat(deltaY) + 'px');
       }
    }
  
  if (shape.tagName == 'ellipse') {
            if (deltaX < 0) {
              shape.setAttributeNS(null, 'cx', (fromX + deltaX / 2) + 'px');
              shape.setAttributeNS(null, 'rx', (-deltaX / 2) + 'px');
            }
            else {
              shape.setAttributeNS(null, 'cx', (fromX + deltaX / 2) + 'px');
              shape.setAttributeNS(null, 'rx', (deltaX / 2) + 'px');
            }
          
            if (deltaY < 0) {
              shape.setAttributeNS(null, 'cy', (fromY + deltaY / 2) + 'px');
              shape.setAttributeNS(null, 'ry', (-deltaY / 2) + 'px');
            }
            else {
              shape.setAttributeNS(null, 'cy', (fromY + deltaY / 2) + 'px');
              shape.setAttributeNS(null, 'ry', (deltaY / 2) + 'px');
            }
  }
  if (shape.tagName == 'line') {
             shape.setAttributeNS(null, 'x2', toX);
          shape.setAttributeNS(null, 'y2', toY);
  } 
  if (shape.tagName == 'polyline') {    
        
       xpArray.push(toX);
          ypArray.push(toY);  
                   var thispath=''+xpArray[1]+','+ypArray[1];  
 		    var thispath1=''; 
		    var thispath2='';
                  var maxcont=xpArray.length;
      
        for(var conta=2;conta< maxcont;conta++){        
          thispath1+=' '+xpArray[conta]+' '+ypArray[conta];
          thispath2+=' '+xpArray[conta]+', '+ypArray[conta];  
	
        }

       
		shape.setAttributeNS(null,'points',thispath+thispath1);
	
	
    }    
    
  if (shape.tagName == 'path') {
        
    if (selectmode == 'controlpath')
     {   
                var end='';
	if(data_path_close==true){end='z';}

        var thispath='M'+setPoints[0]+' ';  
        var maxcont=setPoints.length;
      
        for(var conta=1;conta< maxcont;conta++){        
          thispath+='L'+setPoints[conta]+' ';
          
	
        }                               
        var path=thispath+'L'+toX+','+toY+end;
          //var pointshape=shape.getAttributeNS(null,"d");
         	shape.setAttributeNS(null,'d',path);
               //document.forms[0].control_codebase.value=path;
     }
      else
     { 
  
	  xpArray.push(toX);
          ypArray.push(toY);  
  
                    var thispath=''+xpArray[1]+','+ypArray[1];  
 		    var thispath1=''; 
		    var thispath2='';
                  var maxcont=xpArray.length;
      
        for(var conta=2;conta< maxcont;conta++){        
          thispath1+=' '+xpArray[conta]+' '+ypArray[conta];
          thispath2+=' '+xpArray[conta]+', '+ypArray[conta];  
	  //if((conta+2)%3==0){thispath2+=' C';}
        }
        var end='';
	if(data_path_close==true){end='z';}
		shape.setAttributeNS(null,'d','M '+thispath+ ' L'+thispath2+end);
       
       
          
      /*      
  
           var pointshape=shape.getAttributeNS(null,"points");
          var thispoint=' '+toX+' '+toY;  
             $('status').innerHTML =pointshape; 
        shape.setAttributeNS(null,'points',pointshape+thispoint)
        shape.setAttributeNS(null, 'stroke-width', "25");  
        shape.setAttributeNS(null, 'fill', "#FFFF00");
    
    //shape.points.push(toX);
    //shape.points.push(toY);
    //shape.setAttribute("points",pointshape+);      
         // var maxcont=xpArray.length-1;
          var thispath=''+xpArray[1]+','+ypArray[1];  
       var maxcont=xpArray.length;
       //alert(maxcont);
        for(var conta=2;conta< maxcont;conta++){        
          thispath+=','+xpArray[conta]+','+ypArray[conta]; 
        }
        //alert(shape.points[1]);
    //shape.setAttribute("points",thispath);       
    //points.Value = thispath;       
      var thispath=''+xpArray[1]+','+ypArray[1];  
       var maxcont=xpArray.length;
       //alert(maxcont);
        for(var conta=1;conta< maxcont;conta++){        
          thispath+=','+xpArray[conta]+','+ypArray[conta];
        }
        
        shape.points.Value = thispath;
        */  
          
          
     
  
        /*
 
          
       //this.renderer.move(this.selected, this.selectedBounds.x + deltaX, this.selectedBounds.y + deltaY); 
       // shape.setAttributeNS(null,'transform', "translate("+(toX)+","+(toy)+")");

        
       
         var thispath=''+xpArray[0]+','+ypArray[0]; 
       var maxcont=xpArray.length;
        //shape.setAttributeNS(null,'transform', "translate("+toX+","+toY+")");
        for(var conta=1;conta< maxcont;conta++){        
          thispath+=','+xpArray[conta]+','+ypArray[conta];
        }
           
        shape.setAttributeNS(null, 'x', toX);
        shape.setAttributeNS(null, 'y', toY);
     shape.setAttributeNS(null, 'points', thispath);
      */
    }  
  } 
  if (shape == 'text') {}  
    
}; 
SVGRenderer.prototype.tocurve = function()  
{
  var points=$('control_codebase').value.split('L');
     var chain='';
     chain+=points[0]+'C';
     var numpoints=points.length-1;
     for(var a=1;a<numpoints;a++)
      {
       if(a%3==0)
        { 
         chain+=points[a]+'C';
        }
         else
        {
         chain+=points[a];       
        } 
      } 
      if(numpoints%3==0){
        chain+=points[numpoints]+'';
      } 
      if(numpoints%3==2){
        chain+=points[numpoints-1]+'';
        chain+=points[numpoints]+'';
      } 
      if(numpoints%3==1){ 
        chain+=points[numpoints-1]+'';
        chain+=points[numpoints-1]+'';
        chain+=points[numpoints]+'';
      } 
      if(numpoints%3==3){ 
        chain+=points[numpoints-1]+'';
        chain+=points[numpoints-1]+'';
        chain+=points[numpoints-1]+'';
        chain+=points[numpoints]+'';
      } 

      $('someinfo').value=numpoints+ ' '+ numpoints%3;
      $('control_codebase').value=chain; 
      setShape(); 
 };     
SVGRenderer.prototype.info = function(shape)
{   

var shInfo = {};
if(shape.id != "tracker"){
shInfo.id = shape.id.substr(6);
 shInfo.type = shape.tagName;
 if(shape.tagName !='image')
  {
    shInfo.fillColor = shape.getAttribute('fill')
    shInfo.lineColor = shape.getAttribute('stroke')  
    shInfo.fillOpac = parseFloat(shape.getAttribute('fill-opacity'))
    shInfo.lineOpac = parseFloat(shape.getAttribute('stroke-opacity'))
    shInfo.lineWidth = parseFloat(shape.getAttribute('stroke-width'))
  }  
 
 
 if (shape.tagName == 'rect') 
   {
   if(shape.getAttribute('rx') || shape.getAttribute('ry')){
   shInfo.type = "roundrect";
   shInfo.rx = parseFloat(shape.getAttribute('rx'))
   shInfo.ry = parseFloat(shape.getAttribute('rx'))
   }
    shInfo.left = parseFloat(shape.getAttribute( 'x'));
    shInfo.top = parseFloat(shape.getAttribute( 'y'));
    shInfo.width = parseFloat(shape.getAttribute('width'));
    shInfo.height = parseFloat(shape.getAttribute('height'));  
   }
  else if (shape.tagName == 'ellipse') 
   {
    shInfo.width = parseFloat(shape.getAttribute('rx'))*2;
    shInfo.height = parseFloat(shape.getAttribute('ry'))*2;   
    shInfo.left =    parseFloat(shape.getAttribute('cx')) - (shInfo.width/2);
    shInfo.top =  parseFloat(shape.getAttribute('cy')) - (shInfo.height/2)  ;
 
   }
  else if (shape.tagName == 'line') 
   {
    shInfo.left = parseFloat(shape.getAttribute('x1'));
    shInfo.top = parseFloat(shape.getAttribute('y1'));
    shInfo.width = parseFloat(shape.getAttribute('x2')) -shInfo.left;
    shInfo.height = parseFloat(shape.getAttribute('y2')) -shInfo.top;
   } 
  else if (shape.tagName == 'polyline') 
   {
    shInfo.points = shape.getAttribute('points');
   }
  else 
  
  if (shape.tagName == 'path')
   {
    shInfo.d = shape.getAttribute('d');     
    shInfo.transform = shape.getAttribute('transform'); 
 
    //alert(shInfo.transform);
    //document.forms[0].codebase.value=shape.getAttribute('d'); 
   
   }
  else 
  
  if(shape.tagName == "text"){
   shInfo['font-family'] = shape.getAttribute('font-family')
   shInfo['font-size'] = parseInt(shape.getAttribute('font-size'))
   shInfo.top = parseFloat(shape.getAttribute('y'))
   shInfo.left = parseFloat(shape.getAttribute('x'))
   shInfo.text = shape.textContent 
   shInfo.lineWidth = parseFloat(shape.getAttribute('stroke-width'))
 
   //shInfo.text = shape.nodeValue;
   }
  else
 
  if (shape.tagName == 'image')
   {                                     
    
    shInfo.left = parseFloat(shape.getAttribute( 'x'));
    shInfo.top = parseFloat(shape.getAttribute( 'y'));
    shInfo.width = parseFloat(shape.getAttribute('width'));
    shInfo.height = parseFloat(shape.getAttribute('height'));   
    shInfo.fillOpac = parseFloat(shape.getAttribute('opacity'));   
    shInfo.href = shape.getAttribute('href');  
     
  } 
  }else{
   //do nothing if its the tracker
   }
   return shInfo;  
   	
   	
}





SVGRenderer.prototype.transformShape = function(shape,data,transform)
{      
  var svgNamespace = 'http://www.w3.org/2000/svg'; 
  var xlinkNS="http://www.w3.org/1999/xlink"; 
   //
 
 if(shape.tagName == 'rect')
  { 
    var box = shape.getBBox();
    var sdata=data.split(';'); 
    
    //alert(data[0]);     
    shape.setAttributeNS(null,'x',parseFloat(sdata[0]));
    shape.setAttributeNS(null,'y',parseFloat(sdata[1]));   
    shape.setAttributeNS(null, 'width', parseFloat(sdata[2]));     
    shape.setAttributeNS(null, 'height', parseFloat(sdata[3])); 
    var centerx=parseFloat(sdata[0])+parseFloat(box.width/2);
    var centery=parseFloat(sdata[1])+parseFloat(box.height/2);    
    shape.setAttributeNS(null, 'transform','rotate('+parseFloat(sdata[4])+','+centerx+','+centery+')');
    
   //shape.nodeValue=data;
  }
   else 
 if(shape.tagName == 'text')
  {    
    if(data.indexOf('<;>',0)==-1 )
     {  
      shape.textContent = data;  
     }
      else
     {  
       var sdata=data.split('<;>'); //?????????
       shape.textContent = sdata[0]; 
       shape.setAttributeNS(null,'font-size',parseFloat(sdata[1])); 
        shape.setAttributeNS(null,'font-family',sdata[2]);
     }
   //shape.nodeValue=data;
  }
   else
 if (shape.tagName == 'polyline') 
  {
    shape.setAttributeNS(null,'points',data);
  }
   else 
 if (shape.tagName == 'image') 
  {   
    //alert(data);  
    if(data.indexOf(';',0)==-1 )
     {  
      shape.setAttributeNS(xlinkNS,'href',data);
     }
      else
     {  
        var box = shape.getBBox();
        var sdata=data.split(';');
        shape.setAttributeNS(null,'x',parseFloat(sdata[0]));
        shape.setAttributeNS(null,'y',parseFloat(sdata[1]));   
        shape.setAttributeNS(null, 'width', parseFloat(sdata[2])); 
        shape.setAttributeNS(null, 'height',parseFloat(sdata[3]));  
        var centerx=parseFloat(sdata[0])+parseFloat(box.width/2);
        var centery=parseFloat(sdata[1])+parseFloat(box.height/2);    
        shape.setAttributeNS(null, 'transform',' rotate('+parseFloat(sdata[4])+','+centerx+','+centery+')');


     } 
      
  }
   else 
 if (shape.tagName == 'path')
  {     
    if(data.indexOf(';',0)==-1 )
     {  
    	shape.setAttributeNS(null, 'd', data);  
    	shape.setAttributeNS(null, 'transform', transform);  
     }
      else
     {  
        var box = shape.getBBox();
        var sdata=data.split(';');
        var centerx=parseFloat(sdata[0])+parseFloat(box.width/2);
        var centery=parseFloat(sdata[1])+parseFloat(box.height/2);    
        shape.setAttributeNS(null, 'transform','scale('+parseFloat(sdata[2])+','+parseFloat(sdata[3])+')'+' rotate('+parseFloat(sdata[4])+','+centerx+','+centery+')'+' translate('+parseFloat(sdata[0])+','+parseFloat(sdata[1])+')');


     } 
  }  
   	                             
	                             
}
SVGRenderer.prototype.editShape = function(shape,data)
{   
 if(shape.tagName == 'text'){
   shape.textContent = data
 }else
   if (shape.tagName == 'polyline') 
   {
    shape.setAttributeNS(null,'points',data);
   }
  else 
  
  if (shape.tagName == 'path')
   {
    	shape.setAttributeNS(null, 'd', data);  
    	
   }  
	
}
SVGRenderer.prototype.editCommand = function(shape, cmd, value)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (value != '')
        shape.setAttributeNS(null, 'fill', value);
      else
        shape.setAttributeNS(null, 'fill', 'none');
    }
    else if (cmd == 'linecolor') {
      if (value != '')
        shape.setAttributeNS(null, 'stroke', value);
      else
        shape.setAttributeNS(null, 'stroke', 'none');
    }
    else if (cmd == 'linewidth') {
      shape.setAttributeNS(null, 'stroke-width', parseInt(value) + 'px');
    } 
    else if (cmd == 'fillopacity') {
           if(shape.tagName=='image')
            {
             shape.setAttributeNS(null, 'opacity', parseFloat(value));
            }
             else
            {
                shape.setAttributeNS(null, 'fill-opacity', parseFloat(value));
            }    
      
    }
    else if (cmd == 'lineopacity') {         
      
      shape.setAttributeNS(null, 'stroke-opacity', parseFloat(value));
      
    }

  }
}


SVGRenderer.prototype.queryCommand = function(shape, cmd)
{
  var result = '';
  
  if (shape != null) {
    if (cmd == 'fillcolor') {
      result = shape.getAttributeNS(null, 'fill');
      if (result == 'none')
        result = '';
    }
    else if (cmd == 'linecolor') {
      result = shape.getAttributeNS(null, 'stroke');
      if (result == 'none')
        result = '';
    }
    else if (cmd == 'linewidth') {
      result = shape.getAttributeNS(null, 'stroke');
      if (result == 'none')
        result = '';
      else
        result = shape.getAttributeNS(null, 'stroke-width');
    }
    else if (cmd == 'fillopacity') {
           if(shape.tagName=='image')
            {
             shape.setAttributeNS(null, 'opacity', parseFloat(value));
            }
             else
            {
                shape.setAttributeNS(null, 'fill-opacity', parseFloat(value));
            }    
      
    }
    else if (cmd == 'lineopacity') {         
      
      shape.setAttributeNS(null, 'stroke-opacity', parseFloat(value));
      
    }

  }
  
  return result;
}

SVGRenderer.prototype.showMultiSelect = function(iniX,iniY) { 
  var tracker = document.getElementById('trackerMultiSelect');
  if (tracker) {
    this.remove(tracker);
  }
  
  var coord=this.editor.inputxy;
	toX=parseFloat(coord[0]);
	toY=parseFloat(coord[1]); 
	
    tracker = document.createElementNS(svgNamespace, 'rect'); 
      
    tracker.setAttributeNS(null, 'x', iniX);
    tracker.setAttributeNS(null, 'y', iniY);    
  tracker.setAttributeNS(null, 'width', toX);
  tracker.setAttributeNS(null, 'height', toY);
  tracker.setAttributeNS(null, 'fill', '#ffffff');
  tracker.setAttributeNS(null, 'stroke', 'green');
  tracker.setAttributeNS(null, 'stroke-width', '1');  
  
   this.svgRoot.appendChild(tracker);     
}


function mouseCoord()
{                                           
   var coord=this.editor.inputxy;
   coord[0]=parseFloat(coord[0]);
   coord[1]=parseFloat(coord[1]); 
   return coord
} 
/*
function nodeHit(node)
{                                           
   node.addEventListener("mousemove", function(event) {nodeMove(node)}, false);            
  
}

function nodeUp(node)
{                                           
   //node.stopObserving("mousemove");
}                                                                             

function nodeMove(node)
{                                           
   var mypath=$('control_codebase').value; 
   var  x= $('option_path_x').value;
   var y= $('option_path_y').value; 
   var precoord=x+','+y; 
    var coord=mouseCoord(); 
   node.setAttributeNS(null, 'x', coord[0]-2); 
   node.setAttributeNS(null, 'y', coord[1]-2); 

   $('option_path_x').value=parseFloat(node.getAttributeNS(null,'x'))+2; 
   $('option_path_y').value=parseFloat(node.getAttributeNS(null,'y'))+2; 
   
    var  cadx= $('option_path_x').value;
    var cady= $('option_path_y').value; 
    var coord=cadx+','+cady;
          var cad1=new RegExp(precoord,"g");
      
      
      var result=mypath.replace(cad1, coord);
      
     
      $('control_codebase').value=result; 
      
      $('someinfo').value=precoord;
      setShape();

    
    
} 
*/                                                                              
var memoNode=null; 
var memoPrevControl=new Array();
var memoNextControl=new Array();
SVGRenderer.prototype.nodeMove = function(newx,newy) { 
    var mypath=$('control_codebase').value; 
   var  x= $('option_path_x').value;
   var y= $('option_path_y').value; 
   var precoord=x+','+y; 
   
   $('option_path_x').value=newx; 
   $('option_path_y').value=newy; 
    
      var  cadx= newx;
      var cady= newy; 
  
      var coord=cadx+','+cady;
          var cad1=new RegExp(precoord,"g");
      
      
      var result=mypath.replace(cad1, coord);
      
     
      $('control_codebase').value=result; 
      
      $('someinfo').value=precoord;
      setShape();

}

function drawNodeControl(svg,numId){

      var svgNamespace = 'http://www.w3.org/2000/svg';
      var color1='#0066ff';          
           // if(parseInt(memoNode.id)==a){   
                   
                   var pointprev=memoPrevControl[numId].split(',');
            
                  var controlNode1 = document.createElementNS(svgNamespace, 'rect'); 
                  controlNode1.setAttributeNS(null, 'x', pointprev[0]-2);
                  controlNode1.setAttributeNS(null, 'y', pointprev[1]-2);
          
                  controlNode1.setAttributeNS(null, 'width', 4);
                  controlNode1.setAttributeNS(null, 'height', 4);
                  controlNode1.setAttributeNS(null, 'fill', color1);
                  controlNode1.setAttributeNS(null, 'stroke', '#000000');
                  controlNode1.setAttributeNS(null, 'stroke-width', '0'); 
                  controlNode1.setAttributeNS(null, 'id', 'controlNode1'); 
                  controlNode1.addEventListener("mousedown", function(event) {if(memoNode != null){memoNode.setAttributeNS(null, 'stroke-width', 0 );} memoNode=this; this.setAttributeNS(null, 'fill-color', '#ffff00' );this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2;  }, false);
                  svg.appendChild(controlNode1);  
                  
                   var pointnext=memoNextControl[numId].split(',');
                  
               
                  var controlNode2 = document.createElementNS(svgNamespace, 'rect'); 
                  controlNode2.setAttributeNS(null, 'x', pointnext[0]-2);
                  controlNode2.setAttributeNS(null, 'y', pointnext[1]-2);
          
                  controlNode2.setAttributeNS(null, 'width', 4);
                  controlNode2.setAttributeNS(null, 'height', 4);
                  controlNode2.setAttributeNS(null, 'fill', color1);
                  controlNode2.setAttributeNS(null, 'stroke', '#000000');
                  controlNode2.setAttributeNS(null, 'stroke-width', '0'); 
                  controlNode2.setAttributeNS(null, 'id', 'controlNode1'); 
                  controlNode2.addEventListener("mousedown", function(event) {if(memoNode != null){memoNode.setAttributeNS(null, 'stroke-width', 0 );} memoNode=this; this.setAttributeNS(null, 'fill-color', '#ffff00' );this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2;  }, false);
                  svg.appendChild(controlNode2);  

            //}


}  
                                                                   
SVGRenderer.prototype.showNodesCurve = function(path,controlNodeNum){ 
     memoNextControl=new Array();
     memoPrevControl=new Array();
     var svgNamespace = 'http://www.w3.org/2000/svg';
    // tracker = document.createElementNS(svgNamespace, 'g');   
     var svg = this.container.ownerDocument.createElementNS(svgNamespace, 'g'); 
      svg.setAttributeNS(null, 'id', 'editNodesPath'); 

     /* var group = document.getElementById('editNodesPath');
      if (group) 
       {
           this.remove(group);
       }
       */

  var points=path.split('C');
     var chain='';
     var segment=' ';  
     prevControl=' ';
     nextControl=' ';
     nodePoint=' ';
      var init=points[0].split('M'); 
      var allcoords=init[1].split(' ');
      var point=allcoords[0].split(',');
          var rect1 = document.createElementNS(svgNamespace, 'rect');  
        rect1.setAttributeNS(null, 'x', point[0]-2);
        rect1.setAttributeNS(null, 'y', point[1]-2);
          
        rect1.setAttributeNS(null, 'width', 4);
        rect1.setAttributeNS(null, 'height', 4);
        rect1.setAttributeNS(null, 'fill', '#ff7700');
        rect1.setAttributeNS(null, 'stroke', '#000000');
        rect1.setAttributeNS(null, 'stroke-width', '0');  
        rect1.setAttributeNS(null, 'id', '0'); 
        //rect1.addEventListener("mouseover", function(event) {this.setAttributeNS(null, 'stroke-width', 1 ); }, false);
        rect1.addEventListener("mousedown", function(event) {if(memoNode != null){memoNode.setAttributeNS(null, 'stroke-width', 0 );} memoNode=this; this.setAttributeNS(null, 'fill-color', '#ffff00' );this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2;  }, false);

        //rect1.addEventListener("mouseout", function(event) {this.setAttributeNS(null, 'stroke-width', 0 );}, false);

        svg.appendChild(rect1);                                    
      
          if(controlNodeNum==0){ var color='#ffff00';}  
         if(controlNodeNum==1){var color='#00ffff';}  
         if(controlNodeNum==2){var color='#00cc00';}  
         var color1='#ffff00';
      
     var numpoints=points.length-1;
     for(var a=1;a<=numpoints;a++)
      { 
        
        
            
        segment=points[a].split(' ');
         prevControl=segment[0]+' '; 
         nextControl=segment[1]+' '; 
         nodePoint=segment[2]+' ';     
         memoPrevControl[a]=prevControl;
         memoNextControl[a]=nextControl;
         if(controlNodeNum==0){chain+=prevControl; var point=prevControl.split(',');}  
         if(controlNodeNum==1){chain+=nextControl; var point=nextControl.split(',');}  
         if(controlNodeNum==2){chain+=nodePoint; var point=nodePoint.split(',');}  
         
         if(memoNode!=null){
         }
          var rect1 = document.createElementNS(svgNamespace, 'rect');  
        rect1.setAttributeNS(null, 'x', point[0]-2);
        rect1.setAttributeNS(null, 'y', point[1]-2);
          
        rect1.setAttributeNS(null, 'width', 4);
        rect1.setAttributeNS(null, 'height', 4);
        rect1.setAttributeNS(null, 'fill', color);
        rect1.setAttributeNS(null, 'stroke', '#000000');
        rect1.setAttributeNS(null, 'stroke-width', '0'); 
        rect1.setAttributeNS(null, 'id', ''+a); 
        rect1.addEventListener("mousedown", function(event) {if(memoNode != null){memoNode.setAttributeNS(null, 'stroke-width', 0 );}drawNodeControl(svg,this.getAttributeNS(null,'id')); memoNode=this; this.setAttributeNS(null, 'fill-color', '#ffff00' );this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2;  }, false);

        //rect1.addEventListener("mouseover", function(event) {this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2; }, false);
        // rect1.addEventListener("mousedown", function(event) {nodeHit(this);if(memoNode != null){memoNode.setAttributeNS(null, 'stroke-width', 0 );} memoNode=this; this.setAttributeNS(null, 'fill-color', '#ffff00' );this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2; document.forms[0].option_path_x.focus(); }, false);
         //rect1.addEventListener("mousedown", function(event) { if(memoNode != null){memoNode.setAttributeNS(null, 'stroke-width', 0 );} nodeHit(this); memoNode=this;this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2; }, false);
         //rect1.addEventListener("mousedown", function(event) {if(memoNode != null){memoNode.setAttributeNS(null, 'stroke-width', 0 );} addControlPoints(segment[0],segment[1],svg); memoNode=this; this.setAttributeNS(null, 'fillColor', '#ffff00' );this.setAttributeNS(null, 'stroke-width', 1 );$('option_path_num').value=this.getAttributeNS(null,'id'); $('option_path_x').value=parseFloat(this.getAttributeNS(null,'x'))+2; $('option_path_y').value=parseFloat(this.getAttributeNS(null,'y'))+2; }, false);
         //rect1.addEventListener("mouseup", function(event) {nodeUp(this); }, false);
         //rect1.addEventListener("mouseover", function(event) {this.setAttributeNS(null, 'fillColor', '#ffcc00' ); }, false);
         //rect1.addEventListener("mouseout", function(event) {this.setAttributeNS(null, 'fillColor', '#00cc00' ); }, false);
         

         //rect1.addEventListener("mouseout", function(event) {this.setAttributeNS(null, 'stroke-width', 0 ); }, false);

        svg.appendChild(rect1);                                    
         
      }                     
      var info='';
       
         if(controlNodeNum==0){info='prev Control'}  
         if(controlNodeNum==1){info='next Control'}  
         if(controlNodeNum==2){info='points node'}   
        // $('someinfo').value=numpoints+ ' '+info+':'+ chain;
        $('someinfo').value='Crtl+Arrow to move';
    //return chain;                                          
    

      //this.svgRoot.appendChild(svg);   
    
    return svg;  
        
};


SVGRenderer.prototype.showTracker = function(shape,pathsEdit) {  

  var box = shape.getBBox();
 var matrix = shape.getScreenCTM();
  var trshape= shape.getAttributeNS(null, 'transform');  
  var shap=1; 
  var T = shape.getCTM();
  //a,b,c,d,e,f

    
 
 
    //var thisTransform = {  sx: s[0], r: shape.vRotate, t: shape.vTranslate };
    //if (currentTransform != null) alert(currentTransform.t);
 
  if (shape.tagName == 'rect') { 
     
     $('option_rect_rot').value= T.b* (Math.PI * 2 / 360); 
     $('option_rect_trx').value= box.x;  
     $('option_rect_try').value= box.y;
     $('option_rect_sclx').value= box.width;  
     $('option_rect_scly').value= box.height;

  }  

  if (shape.tagName == 'image'){
    $('option_img_trx').value= box.x; 
    $('option_img_try').value= box.y;
    $('option_img_sclx').value= box.width;  
    $('option_img_scly').value= box.height;
    $('option_img_rot').value= T.b* (Math.PI * 2 / 360);
  }
  if (shape.tagName == 'text'){
   /* f$('option_text_trx').value= box.x; 
    $('option_text_try').value= box.y;
    $('option_text_sclx').value= box.width;  
    $('option_text_scly').value= box.height;
    $('option_text_rot').value= T.b* (Math.PI * 2 / 360);
   */
  }
  if (shape.tagName == 'line'){ 
    /*
    $('option_line_trx').value= box.x;  
    $('option_line_try').value= box.y;
    */
  }   
  if (shape.tagName == 'ellipse'){  
    /*$('option_ellipse_trx').value= putx;  
    $('option_ellipse_try').value= puty;
    $('option_ellipse_sclx').value= box.width;  
    $('option_ellipse_scly').value= box.height;
    $('option_ellipse_rot').value= T.b* (Math.PI * 2 / 360);
    */
  }
  
  
  
 /* if (shape.getAttributeNS(null, 'transform') ) { 
        
        
        shap=2; }else{
  }*/ 
  var tracker = document.getElementById('tracker');
  if (tracker) {
    this.remove(tracker);
  }

  var svgNamespace = 'http://www.w3.org/2000/svg';
  
     tracker = document.createElementNS(svgNamespace, 'g');    
      tracker.setAttributeNS(null, 'id', 'tracker'); 
      
    var controlPoints=null;
    if (shape.tagName == 'path') { shap=2; 
    
    /* $('option_path_trx').value= box.x;  
     $('option_path_try').value= box.y;
     $('option_path_sclx').value= T.a;   
     $('option_path_scly').value= T.d; 
     $('option_path_rot').value= T.b* (Math.PI * 2 / 360);
     */                                        
     var path=shape.getAttributeNS(null, 'd');
      $('control_codebase').value=path;  
      
       controlPoints=this.showNodesCurve(path,2); 
   
           
        /*   controlPoints=this.showNodesCurve(path,1); 
   
           tracker.appendChild(controlPoints);     
           
           controlPoints=this.showNodesCurve(path,0); 
   
           tracker.appendChild(controlPoints); 
        */   
   }        
      
     var svg = this.container.ownerDocument.createElementNS(svgNamespace, 'g'); 
      svg.setAttributeNS(null, 'id', 'transformSquares'); 
   
          
       //var rect = document.createElementNS(svgNamespace, 'rect');   
       var border = document.createElementNS(svgNamespace, 'path');  
       
       var trshape='translate (0,0) rotate(0) translate(0,0) '; 
       var trshape_split=trshape.split(') ');    
       
      // get_between (trshape, s1, s2) ;
     if(shape.getAttributeNS(null, 'transform')){ 
         var trshape=shape.getAttributeNS(null, 'transform') ;   
         //var spl=trshape.replace(', ',' ');  
         //var spl1=spl.replace(')',' ');    
         var trshape_split=trshape.split(') '); 
         

    }
                                         
  var corners = [];
  var point = createPoint(box.x, box.y, box.width, box.height);
 //point = {x:box.x, y:box.y, width: box.width, height:box.height};
//point = createPoint(box.x, box.y, box.width, box.height);    
  //1
  corners.push( createPoint(box.x + box.width, box.y, box.width, box.height) );
  point.x = box.x + box.width;
  point.y = box.y;
  //2
  corners.push( createPoint(box.x + box.width, box.y + box.height, box.width, box.height) );
  point.x = box.x + box.width;
  point.y = box.y + box.height;
  //3
  //corners.push( point.matrixTransform(matrix) );
  corners.push( createPoint(box.x , box.y + box.height, box.width, box.height) );
  point.x = box.x;
  point.y = box.y + box.height;
  //4
  corners.push( createPoint(box.x + box.width, box.y, box.width, box.height) );   
  
  var max = createPoint(corners[0].x, corners[0].y);
  var min = createPoint(corners[0].x, corners[0].y);

  // identify the new corner coordinates of the
  // fully transformed bounding box
  for (var i = 1; i < corners.length; i++) {
    var x = corners[i].x;
    var y = corners[i].y;
    if (x < min.x) {
      min.x = x;
    }
    else if (x > max.x) {
      max.x = x;
    }
    if (y < min.y) {
      min.y = y;
    }
    else if (y > max.y) {
      max.y = y;
    }
  }
  
  // return the bounding box as an SVGRect object
  //rect = document.createElementNS(svgNamespace, 'rect');
   //rect.setAttributeNS(null, 'x', min.x-10);
    //rect.setAttributeNS(null, 'y', min.y-10);   
    
    //rect.setAttributeNS(null, 'width', max.x - min.x+20);
    //rect.setAttributeNS(null, 'height', max.y - min.y+20);   
     
     border.setAttributeNS(null, 'd', "M"+(min.x-10)+","+ (min.y-10)+' h'+(box.width+20)+','+(0)+' v'+(0)+','+(box.height+20)+' h'+(-box.width-20)+','+(0)+' z M'+(box.x+box.width+10)+","+ (box.y+(box.height/2)+' h'+(25)+',0 '));   
     
     
     border.setAttributeNS(null, 'fill', 'none');
     border.setAttributeNS(null, 'stroke', '#cccccc');
     border.setAttributeNS(null, 'stroke-width', '1'); 
       
// createRect(min.x, min.y, max.x - min.x, max.y - min.y);

      var circle1 = document.createElementNS(svgNamespace, 'ellipse');  
      circle1.setAttributeNS(null, 'cx', (box.x + box.width+40) + 'px');
    circle1.setAttributeNS(null, 'cy', (box.y + box.height / 2) + 'px');
    circle1.setAttributeNS(null, 'rx', (5) + 'px');
    circle1.setAttributeNS(null, 'ry', (5) + 'px');   
   circle1.setAttributeNS(null, 'fill', '#ffffff');
  circle1.setAttributeNS(null, 'stroke', 'green');
  circle1.setAttributeNS(null, 'stroke-width', '1');   

      var circleCenter = document.createElementNS(svgNamespace, 'ellipse');  
      circleCenter.setAttributeNS(null, 'cx', (box.x + (box.width/2)) + 'px');
    circleCenter.setAttributeNS(null, 'cy', (box.y + (box.height /2)) + 'px');
    circleCenter.setAttributeNS(null, 'rx', (10) + 'px');
    circleCenter.setAttributeNS(null, 'ry', (10) + 'px');   
   circleCenter.setAttributeNS(null, 'fill', '#ffffff');
  circleCenter.setAttributeNS(null, 'stroke', 'green');
  circleCenter.setAttributeNS(null, 'stroke-width', '1');   

     var rect1 = document.createElementNS(svgNamespace, 'rect');  
  rect1.setAttributeNS(null, 'width', 10);
  rect1.setAttributeNS(null, 'height', 10);
  rect1.setAttributeNS(null, 'fill', '#ffffff');
  rect1.setAttributeNS(null, 'stroke', 'green');
  rect1.setAttributeNS(null, 'stroke-width', '1');  

  var rect2 = document.createElementNS(svgNamespace, 'rect');  
  rect2.setAttributeNS(null, 'width', 10);
  rect2.setAttributeNS(null, 'height', 10);
  rect2.setAttributeNS(null, 'fill', '#ffffff');
  rect2.setAttributeNS(null, 'stroke', 'green');
  rect2.setAttributeNS(null, 'stroke-width', '1');  

  var rect3 = document.createElementNS(svgNamespace, 'rect');  
  rect3.setAttributeNS(null, 'width', 10);
  rect3.setAttributeNS(null, 'height', 10);
  rect3.setAttributeNS(null, 'fill', '#ffffff');
  rect3.setAttributeNS(null, 'stroke', 'green');
  rect3.setAttributeNS(null, 'stroke-width', '1'); 
  
  var rect4 = document.createElementNS(svgNamespace, 'rect');  
  rect4.setAttributeNS(null, 'width', 10);
  rect4.setAttributeNS(null, 'height', 10);
  rect4.setAttributeNS(null, 'fill', '#ffffff');
  rect4.setAttributeNS(null, 'stroke', 'green');
  rect4.setAttributeNS(null, 'stroke-width', '1');  
 
  var rectmid12 = document.createElementNS(svgNamespace, 'rect');  
  rectmid12.setAttributeNS(null, 'width', 10);
  rectmid12.setAttributeNS(null, 'height', 10);
  rectmid12.setAttributeNS(null, 'fill', '#ffffff');
  rectmid12.setAttributeNS(null, 'stroke', 'green');
  rectmid12.setAttributeNS(null, 'stroke-width', '1');  

  var rectmid23 = document.createElementNS(svgNamespace, 'rect');  
  rectmid23.setAttributeNS(null, 'width', 10);
  rectmid23.setAttributeNS(null, 'height', 10);
  rectmid23.setAttributeNS(null, 'fill', '#ffffff');
  rectmid23.setAttributeNS(null, 'stroke', 'green');
  rectmid23.setAttributeNS(null, 'stroke-width', '1');  

  var rectmid34 = document.createElementNS(svgNamespace, 'rect');  
  rectmid34.setAttributeNS(null, 'width', 10);
  rectmid34.setAttributeNS(null, 'height', 10);
  rectmid34.setAttributeNS(null, 'fill', '#ffffff');
  rectmid34.setAttributeNS(null, 'stroke', 'green');
  rectmid34.setAttributeNS(null, 'stroke-width', '1'); 
  
  var rectmid41 = document.createElementNS(svgNamespace, 'rect');  
  rectmid41.setAttributeNS(null, 'width', 10);
  rectmid41.setAttributeNS(null, 'height', 10);
  rectmid41.setAttributeNS(null, 'fill', '#ffffff');
  rectmid41.setAttributeNS(null, 'stroke', 'green');
  rectmid41.setAttributeNS(null, 'stroke-width', '1');   
   // rect.setAttributeNS(null, 'x', box.x - 10);
   // rect.setAttributeNS(null, 'y', box.y - 10);    
    
    rect1.setAttributeNS(null, 'x', box.x - 10-5);
    rect1.setAttributeNS(null, 'y', box.y - 10-5);  
   
    
    rect2.setAttributeNS(null, 'x', box.x + box.width +5 );
    rect2.setAttributeNS(null, 'y', box.y -10 -5);   

    rect3.setAttributeNS(null, 'x', box.x + box.width+5 );
    rect3.setAttributeNS(null, 'y', box.y + box.height+5);
                                                       
    rect4.setAttributeNS(null, 'x', box.x -10-5 );
    rect4.setAttributeNS(null, 'y', box.y + box.height+5);    

    

    rectmid12.setAttributeNS(null, 'x', box.x + (box.width/2) -5);
    rectmid12.setAttributeNS(null, 'y', box.y - 10-5);  

    rectmid23.setAttributeNS(null, 'x', box.x + box.width +5 );
    rectmid23.setAttributeNS(null, 'y', box.y + (box.height/2)-5);   
    
    rectmid34.setAttributeNS(null, 'x', box.x + (box.width/2)-5 );
    rectmid34.setAttributeNS(null, 'y', box.y + box.height+5);
                                                           
    rectmid41.setAttributeNS(null, 'x', box.x -10-5 );
    rectmid41.setAttributeNS(null, 'y', box.y + (box.height/2)-5);
     
    svg.appendChild(border); 
    //tracker.appendChild(getScreenBBox (shape));
    //currentTranslate
    //currentScale
   // shape.setAttributeNS(null,'transform', "translate("+(box.x+(box.width/2))+","+(box.y+(box.height/2))+") rotate("+rotatexxx+") translate("+(-box.x-(box.width/2))+","+(-box.y-(box.height/2))+") ");

   //var trshape=shape.getAttributeNS(null, 'transform') ; 
  //----tracker.setAttributeNS(null,'transform', "translate("+(box.x+(box.width/2))+","+(box.y+(box.height/2))+") "+trshape_split[1]+") translate("+(-box.x-(box.width/2))+","+(-box.y-(box.height/2))+") ");

    
    
  //}  
   // tracker.appendChild(getScreenBBox (shape));
     var colorin="#ff0000";
      var colorout="#ffffff" 
      
        circle1.addEventListener("mouseover", function(event) {circle1.setAttributeNS(null, 'cursor', 's-resize');  circle1.setAttributeNS(null, 'fill', colorin ); typeTransform='Rotate'; scaleType='nw'; }, false);
     circle1.addEventListener("mouseout", function(event) {circle1.setAttributeNS(null, 'cursor', 'default');  circle1.setAttributeNS(null, 'fill', colorout ); typeTransform='Rotate'; }, false); //typeTransform='rotate'
     circleCenter.addEventListener("mouseover", function(event) {circleCenter.setAttributeNS(null, 'cursor', 'move');  circleCenter.setAttributeNS(null, 'fill', colorin ); typeTransform='sp�nCenter'; scaleType='nw'; }, false);
     circleCenter.addEventListener("mouseout", function(event) {circleCenter.setAttributeNS(null, 'cursor', 'default');  circleCenter.setAttributeNS(null, 'fill', colorout ); typeTransform=''; }, false); //typeTransform='rotate'
 
      
     //rect1.addEventListener("mouseover", cursore1in, false);    
     rect1.addEventListener("mouseover", function(event) {rect1.setAttributeNS(null, 'cursor', 'nw-resize');  rect1.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='nw';}, false);
     rect1.addEventListener("mouseout", function(event) {rect1.setAttributeNS(null, 'cursor', 'default');  rect1.setAttributeNS(null, 'fill', colorout ); typeTransform='Scale'; }, false); //typeTransform='rotate'
     //rect1.addEventListener("click", function(event) { rect1.setAttributeNS(null, 'fill', '#00ff00' ); typeTransform='Scale'; }, false);
    
     rect2.addEventListener("mouseover", function(event) {rect2.setAttributeNS(null, 'cursor', 'ne-resize');  rect2.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='ne';}, false);  
     rect2.addEventListener("mouseout", function(event) {rect2.setAttributeNS(null, 'cursor', 'default');  rect2.setAttributeNS(null, 'fill', colorout ); typeTransform='Scale'; }, false);
      
     rect3.addEventListener("mouseover", function(event) {rect3.setAttributeNS(null, 'cursor', 'se-resize');  rect3.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='se';}, false);  
     rect3.addEventListener("mouseout", function(event) {rect3.setAttributeNS(null, 'cursor', 'default');  rect3.setAttributeNS(null, 'fill', colorout ); typeTransform='Scale'; }, false);
     
     rect4.addEventListener("mouseover", function(event) {rect4.setAttributeNS(null, 'cursor', 'sw-resize');  rect4.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='sw';}, false);  
     rect4.addEventListener("mouseout", function(event) {rect4.setAttributeNS(null, 'cursor', 'default');  rect4.setAttributeNS(null, 'fill', colorout ); typeTransform='Scale'; }, false);
                                                    
     rectmid12.addEventListener("mouseover", function(event) {rectmid12.setAttributeNS(null, 'cursor', 'n-resize');  rectmid12.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='n';}, false);  
     rectmid12.addEventListener("mouseout", function(event) {rectmid12.setAttributeNS(null, 'cursor', 'default');  rectmid12.setAttributeNS(null, 'fill', colorout ); typeTransform=''; }, false); 

     rectmid23.addEventListener("mouseover", function(event) {rectmid23.setAttributeNS(null, 'cursor', 'e-resize');  rectmid23.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='e';}, false);  
     rectmid23.addEventListener("mouseout", function(event) {rectmid23.setAttributeNS(null, 'cursor', 'default');  rectmid23.setAttributeNS(null, 'fill', colorout ); typeTransform=''; }, false); 
     
     rectmid34.addEventListener("mouseover", function(event) {rectmid34.setAttributeNS(null, 'cursor', 's-resize');  rectmid34.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='s';}, false);  
     rectmid34.addEventListener("mouseout", function(event) {rectmid34.setAttributeNS(null, 'cursor', 'default');  rectmid34.setAttributeNS(null, 'fill', colorout ); typeTransform=''; }, false); 

     rectmid41.addEventListener("mouseover", function(event) {rectmid41.setAttributeNS(null, 'cursor', 'w-resize');  rectmid41.setAttributeNS(null, 'fill', colorin ); typeTransform='Scale'; scaleType='w'; }, false);  
     rectmid41.addEventListener("mouseout", function(event) {rectmid41.setAttributeNS(null, 'cursor', 'default');  rectmid41.setAttributeNS(null, 'fill', colorout ); typeTransform=''; }, false); 
     
     //////////
     svg.setAttributeNS(null, 'transform',trshape); 
  
    svg.appendChild(circle1);    
    //tracker.appendChild(circleCenter);  
   if (shape.tagName != 'text'){   
    svg.appendChild(rect1); 
    svg.appendChild(rect2);   
    svg.appendChild(rect3); 
    svg.appendChild(rect4);  
    svg.appendChild(rectmid12);  
    svg.appendChild(rectmid23);
    svg.appendChild(rectmid34);
    svg.appendChild(rectmid41);                                    
  
  }  
    if(pathsEdit)
     {    
        controlPoints.setAttributeNS(null, 'transform',trshape); 
        tracker.appendChild(controlPoints);      
     }else{   
        tracker.appendChild(svg); 
     }   
  this.svgRoot.appendChild(tracker);  
      
}


SVGRenderer.prototype.getMarkup = function() { 
       
  return this.container.innerHTML;
}   


/////////////////////////////////
var rotatexxx=0; 
 
var scaleType=''; 
var xrot=0;
var yrot=0;  

var point = {x:0, y:0, width: 0, height:0};

function createPoint (x, y, width, height) {
    //var point = {x:34, y:22, width: 22, height:23};
    //point.x = x;
    //point.y = y;   
    point = {x:x, y:y, width: width, height:height};
    return point;
  }

///////////////////////////////

SVGRenderer.prototype.restruct= function(shape)
{
 //alert('end');       
 //forceRedraw(); 
//clearWorkspace();  
//document.getElementById('richdraw').style.cursor='default';    
};        



SVGRenderer.prototype.transform = function() {
    //document.forms[0].code.value='Im tranforming';
};

SVGRenderer.prototype.scaleShape = function(shape,previus, toX, toY) {

	 var box = shape.getBBox();  
	 var prevbox=previus.getBBox();
	var centerx= box.x+(box.width/2);
	var centery= box.y+(box.height/2); 
	var coord=this.editor.inputxy;
	toX=parseFloat(coord[0]);
	toY=parseFloat(coord[1]); 
	var d2p_center=dist2p(centerx,centery,toX,toY);       

	var d2p=dist2p(box.x,box.y,toX,toY);

	var shareScale=box.width/d2p;

	var trans_ShareScale='';
	var tx, ty, tw, yh;

	if(scaleType.length==1){
		if(scaleType== 'w')
		 {
			trans_ShareScale=shareScale+",1";  
			tx=toX; 
			ty=prevbox.y; 
			var dist=prevbox.x-toX;
			var w=dist+prevbox.width;
			if(w<1){w=1;}
			tw=w;
			th=prevbox.height;
			//document.forms[0].code.value=box.x+' '+toX+' '+dist+''; 
		 }        
		if(scaleType== 'e')
		 {
		        trans_ShareScale=shareScale+",1"; 
			tx=prevbox.x; 
			ty=prevbox.y; 
			var dist=toX-(prevbox.x+prevbox.width); //dist2p(toX,b,c,d);
			var w=dist+prevbox.width;
			if(w<1){w=1;}
			tw=w;
			th=prevbox.height;
 
		 }        
		if(scaleType== 'n')
		 {
			trans_ShareScale="1,"+shareScale; 
			
			tx=prevbox.x; 
			ty=toY; 
			var dist=prevbox.y-toY;
			var h=dist+prevbox.height;
			if(h<1){h=1;}
			tw=prevbox.width;
			th=h;

		 }
                if( scaleType== 's')
                 {
                        trans_ShareScale="1,"+shareScale;  

			tx=prevbox.x; 
			ty=prevbox.y; 
			var dist=toY-(prevbox.y+prevbox.height); //dist2p(toX,b,c,d);
			var h=dist+prevbox.height;
			if(h<1){h=1;}
			tw=prevbox.width;
			th=h;

	         }
        }
	if(scaleType.length==2){
		if(scaleType== 'nw'){
			trans_ShareScale=shareScale+","+shareScale; 
          
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
      			  var angle_diagonal=ang2v(prevbox.x,prevbox.y,prevbox.x+prevbox.width,prevbox.y+prevbox.height)
            
                        var ax= prevbox.x;
                        var ay= prevbox.y;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y+prevbox.height; 
                        
                        var cx= toX;
                        var cy= toY;
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2));  
                        
                        var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);   
                 //document.forms[0].code.value=angle_diagonal* 180 / Math.PI;       
                    
                var tx= section_a[1];
                var ty= section_a[2];
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x+prevbox.width; 
                        var cy= prevbox.y;

                        var dx= prevbox.x+prevbox.width;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);

                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         

              
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1] 
                        var by= 0; 
                        
                        var cx= prevbox.x; 
                        var cy= prevbox.y+prevbox.height; 

                        var dx= 0; 
                        var dy= prevbox.y+prevbox.height;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
                var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
                
                

                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        //document.forms[0].code.value=distx+' '+disty;
			tw=distx;
			th=disty;

			
		}                  
		
	//////////////////// SE
		
           if( scaleType== 'se'){
			trans_ShareScale=shareScale+","+shareScale;   
			
	          
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
       			var angle_diagonal=ang2v(prevbox.x,prevbox.y,prevbox.x+prevbox.width,prevbox.y+prevbox.height)
		
			
			
                        var ax= prevbox.x;
                        var ay= prevbox.y;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y+prevbox.height; 
                        
                        var cx= toX;
                        var cy= toY;   
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2)); 
      
                var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);   
                
                                         
                 var svgNamespace = 'http://www.w3.org/2000/svg';  
                 var tracker = document.getElementById('tracker');

                //////////
                var tx= prevbox.x;
                var ty= prevbox.y;
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x; 
                        var cy= prevbox.y;

                        var dx= prevbox.x;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               /////////////////
               
               
                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         

             
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1] 
                        var by= 0; 
                        
                        var cx= prevbox.x; 
                        var cy= prevbox.y; 

                        var dx=0;
                        var dy= prevbox.y;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               ///////////////
               
                var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
                
   
                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        
			tw=distx;
			th=disty;

			
		}

		if(scaleType== 'ne'){  
		        
			trans_ShareScale=shareScale+","+shareScale;   
			
	                var angle_diagonal=ang2v(prevbox.x,prevbox.y+prevbox.height,prevbox.x+prevbox.width,prevbox.y)
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
 		
			
				
			
                        var ax= prevbox.x;
                        var ay= prevbox.y+prevbox.height;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y;
                       
                        var cx= toX;
                        var cy= toY;   
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2)); 


                      //document.forms[0].code.value=angle_diagonal;

      
                var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);   
                
                                         
                 var svgNamespace = 'http://www.w3.org/2000/svg';  
                 var tracker = document.getElementById('tracker');

                //////////
                var tx= prevbox.x;
                var ty= section_a[2];
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x; 
                        var cy= prevbox.y;

                        var dx= prevbox.x;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               /////////////////
               
               
                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         

             
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1]; 
                        var by= 0; 
                        
                        var cx= prevbox.x; 
                        var cy= prevbox.y+prevbox.height; 

                        var dx=0;
                        var dy= prevbox.y+prevbox.height;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               ///////////////
               
                var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
                

                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        //document.forms[0].code.value=distx+' '+disty;
			tw=distx;
			th=disty;
			
			
			
			
			
		}
		if(scaleType== 'sw'){
			trans_ShareScale=shareScale+","+shareScale;  
			
			
				
			
	                var angle_diagonal=ang2v(prevbox.x,prevbox.y+prevbox.height,prevbox.x+prevbox.width,prevbox.y)
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
 		
			
				
			
                        var ax= prevbox.x;
                        var ay= prevbox.y+prevbox.height;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y;
                       
                        var cx= toX;
                        var cy= toY;   
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2)); 


                      //document.forms[0].code.value=angle_diagonal;

      
                var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);   
                
                                         
                 var svgNamespace = 'http://www.w3.org/2000/svg';  
                 var tracker = document.getElementById('tracker');

                //////////
                var tx= section_a[1];
                var ty= prevbox.y;
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x+prevbox.width; 
                        var cy= prevbox.y+prevbox.height;

                        var dx= prevbox.x+prevbox.width;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         

               /////////////////             
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1];
                        var by= 0; 
                          
                        var cx= prevbox.x; 
                        var cy= prevbox.y; 

                        var dx=0;
                        var dy= prevbox.y;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
                  var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
              ///////////////
                
   
                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        //document.forms[0].code.value=distx+' '+disty;
			tw=distx;
			th=disty;
			
		}

	}  



 if(shape.tagName == 'rect')
  { 
    //alert(data[0]);     
   shape.setAttributeNS(null,'x',tx);
    shape.setAttributeNS(null,'y',ty);   
    shape.setAttributeNS(null, 'width', tw);     
    shape.setAttributeNS(null, 'height', th); 
    
   //shape.nodeValue=data;
  }
   else 
 if(shape.tagName == 'text')
  {
    /*
    shape.setAttributeNS(null,'x',tx);
    shape.setAttributeNS(null,'y',ty);   
    shape.setAttributeNS(null, 'width', tw);     
    shape.setAttributeNS(null, 'height', th); 
    
    //previus.setAttributeNS(null,'transform', "scale("+trans_ShareScale+")");
     shape.setAttributeNS(null, 'x', tx + 'px');
    shape.setAttributeNS(null, 'y', ty + 'px');

    shape.setAttributeNS(null, 'textLength', parseInt(Math.round(tw)));    
    
     */
  } 
   else 
 if(shape.tagName == 'ellipse')
  {
    //shape.getAttributeNS(null, 'transform)
    shape.setAttributeNS(null, 'cx', (tx + (box.width / 2)) + 'px');
    shape.setAttributeNS(null, 'cy', (ty + (box.height / 2)) + 'px');
    shape.setAttributeNS(null, 'rx', (tw / 2) + 'px');
    shape.setAttributeNS(null, 'ry', (th / 2) + 'px');   
 
        
  }
   else 
 if(shape.tagName == 'line')
  { 
    shape.setAttributeNS(null, 'x1', tx + 'px');
    shape.setAttributeNS(null, 'y1', ty + 'px');
    shape.setAttributeNS(null, 'x2', tx + tw + 'px');
    shape.setAttributeNS(null, 'y2', ty + th + 'px');  
         
  }
   else
 if (shape.tagName == 'polyline') 
  {
   
  }
   else 
 if (shape.tagName == 'image') 
  {   
    shape.setAttributeNS(null,'x',tx);
    shape.setAttributeNS(null,'y',ty);   
    shape.setAttributeNS(null, 'width', tw);     
    shape.setAttributeNS(null, 'height', th); 
      
  }
   else 
 if (shape.tagName == 'path')
  {     
      var xscale=  prevbox.width/tw;
      var yscale=  prevbox.height/th;
      var prevpath=previus.getAttributeNS(null, 'd');
     var path=shape.getAttributeNS(null, 'd');
 path=path.replace(/, /g, ','); 
 path=path.replace(/ ,/g, ',');
 var ps =path.split(" ")
 var pcc = "";

 var xinc=tx-prevbox.x;
 var yinc=ty-prevbox.y;
  
    var re = /^[-]?\d*\.?\d*$/;
 for(var i = 0; i < ps.length; i++)
  { 
   if(ps[i].indexOf(',')>0){  
     
      var point =ps[i].split(","); 
       var char1=point[0].substring(0,1);
       point[1]= parseFloat(point[1]); 
       
       // var valnum =char1.charAt(0); 
       //if (isNaN(valnum))
       if (!char1.match(re)) 
        
       {
         var num0= parseFloat(point[0].substring(1));
         var text=char1;
       }else{
         var num0= parseFloat(point[0]);
         var text='';

       }
       //num0+=dist*angx;
       //point[1]+=dist*angy;
         num0*=xscale;
        point[1]*=yscale;   
        
      // num0+=xinc;
      // point[1]+=yinc;
       
      
        
        var cx=num0;
        var cy=point[1]; 
        pcc+=text+cx+','+cy+' ';
   }else{
      pcc+=ps[i]+' ';
   }
  }


   
    
  
   // $('code').value=dist+' '+ ang+' '+'__'+x+'= '+left+'/ '+y+'= ' +top+'';
    
       //shape.setAttributeNS(null,'transform', "rotate("+left+")");
       
       // shape.setAttributeNS(null,'transform', "translate("+trax+","+tray+") rotate("+0+") scale(1,1)");
         shape.setAttributeNS(null,'d', pcc);

    
    
    
    
    
    
       //document.forms[0].code.value='';
       //shape.setAttributeNS(null,'transform', "scale("+trans_ShareScale+")"); 

  }  
   	                             







	
	
	
	
	
//$('status').innerHTML=typeTransform+': '+shareScale;  
       
  
};


SVGRenderer.prototype.rotateShape = function(shape, previus, toX, toY) {
 
    //document.getElementById('richdraw').style.cursor='e-resize';
     	 var box = shape.getBBox();  
	 var prevbox=previus.getBBox();
	var centerx= box.x+(box.width/2);
	var centery= box.y+(box.height/2); 
	var coord=this.editor.inputxy;

       var actual_angle=ang2v(centerx,centery,coord[0], coord[1]);
       
       if(xrot<toX) { rotatexxx+=1;}else{rotatexxx-=1;}
       xrot=toX;
       yrot=toY;  
       
	var xtr=0;
        var ytr=0;
                
        var box= shape.getBBox();  
        var tr1x=  box.x;  
         var tr1y=  box.y;

 
 
    toX+=xtr;
        toY+=xtr;

      //var trax=parseFloat(toX-box.x);   var tray= parseFloat(toY-box.y);      
      var trax=parseFloat(box.x/2);   var tray= parseFloat(box.y/2); 
       var angler=Math.atan2(toX,toY);
         var angle=angler*180/Math.PI;  
          var T = shape.getCTM(); 
          var rotini=T.a*(180 / Math.PI);
                   var angle=rotini*180/Math.PI;
          var rot_angle=actual_angle*180/Math.PI;  
          //document.forms[0].code.value=centerx+' '+centery+' '+coord[0]+' '+coord[1]+'____ '+rot_angle+' '+actual_angle*180/Math.PI;
          
          
         // matrix( a, b, c, d, e, f )
         // a c e
         // b d f
         // 0 0 1
         //a scale factor of 2, a rotation of 30 deg and a translation of (500,50)
         //T     1.732   -1   500     1   1.732   50     0   0   1
         //T      1  ad-bc      d  -c -de+cf   -b  a  be-df    0   0   1
         
         //shape.setAttributeNS(null,'transform', "translate("+(-xshe)+","+(-yshe)+")");
 
         // shape.setAttributeNS(null,"transform", "  matrix( a, b, c, d, e, f )");
          // shape.setAttributeNS(null,'transform', "translate("+(box.x+(box.width/2))+","+(box.y+(box.height/2))+")  rotate("+rotatexxx+") ");
           //shape.setAttributeNS(null,'transform', "translate("+(box.x+(box.width/2))+","+(box.y+(box.height/2))+") rotate("+rotatexxx+") translate("+(-box.x-(box.width/2))+","+(-box.y-(box.height/2))+") ");
         //shape.setAttributeNS(null,'transform', "rotate("+rotatexxx+","+(box.x+(box.width/2))+","+(box.y+(box.height/2))+")");
         //shape.setAttributeNS(null,'transform', "rotate("+rotatexxx+","+(prevbox.x+(prevbox.width/2))+","+(prevbox.y+(prevbox.height/2))+")");
         shape.setAttributeNS(null,'transform', "rotate("+rot_angle+","+(prevbox.x+(prevbox.width/2))+","+(prevbox.y+(prevbox.height/2))+")");
                          
         
         //alert('[  ['+T.a+'  '+T.c+'  '+T.e+']  ['+T.b+'  '+T.d+'  '+T.f+']  [0  0  1]  ]');
        //a,b,c,d,e,f  
           
          // shape.setAttributeNS(null,'transform', 'matrix('+T.a+', '+T.b+', '+ T.c+', '+ T.d+', '+ T.e+', '+ T.f+')' );
          
          var x1=T.e;
          var y1=T.f;
          var sp = Math.sin(rotatexxx*(Math.PI / 180));
          var cp = Math.cos(rotatexxx*(Math.PI / 180));
          var x2 = 0 + r*rotatexxx*(Math.PI / 180);
          var y2 = 0;
          var r=0; 
           
          var a=cp;
          var c=sp;
          var e=T.e;
          var b=T.b;
          var d=(-x1*cp+y1*sp+x2); 
          var f=(-x1*sp-y1*cp+y2);
      
      var inv=T.inverse;  
      var inv_mat=T.multiply(inv); 
       //var matrix = "matrix(" + cp +"," + sp + "," + (-sp) + "," + cp + ","+ (-x1*cp+y1*sp+x2) + ","+ (-x1*sp-y1*cp+y2) + ")";
       //var matrix = "matrix(" + a +"," + c + "," + e + "," + b + ","+ d + ","+ f + ")";
      var matrix='matrix('+inv_mat.a+' '+inv_mat.b+' '+inv_mat.c+' '+inv_mat.d+' '+inv_mat.e+' '+inv_mat.f+')'
      
       //++ shape.setAttributeNS(null,'transform',matrix); 
        
        //shape.setAttributeNS(null,'transform', "rotate("+rotatexxx+")"); 
        // shape.setAttributeNS(null,'transform', "translate("+(box.x)+","+(box.y)+")");
        
         //shape.setAttributeNS(null,'transform', "rotate("+rotatexxx+")");
               //shape.setAttributeNS(null, 'x', -box.width/2 + 'px');
               //shape.setAttributeNS(null, 'y', -box.height/2 + 'px');
         //shape.setAttributeNS(null,"transform", "matrix("+Math.cos(angle)+", "+Math.sin(angle)+", "+Math.sin(-angle)+", "+Math.cos(angle)+", 0, 0 )");
           //shape.setAttributeNS(null,'transform', "rotate("+10+")"); 
   
               //shape.setAttributeNS(null, 'x', box.width/2 + 'px');
               //shape.setAttributeNS(null, 'y', box.height/2 + 'px');
      
                
  
          //$('status').innerHTML = 'Mode: Draw '+pointshape +'_'+xsh +' '+ ysh+' '+trshape;
          
  //$('status').innerHTML=typeTransform+': '+rotatexxx;  
    
};



// x(u) = x0*(1-u) + x1*u = x0 + (x1-x0)*u
// y(u) = y0*(1-u) + y1*u = y0 + (y1-y0)*u
      
//http://xml-utils.com/conferencia-svg.html#d0e527
//http://www.xml.com/lpt/a/1321
//http://phrogz.net/objjob/object.asp?id=101
//http://admisource.gouv.fr/plugins/scmcvs/cvsweb.php/Cassini-ihm/js-yosemite/mapApp.js?rev=1.1;cvsroot=cassini
//http://groups.google.com/group/prototype-graphic/msg/0547c0caea8869c6 
 //JS File: ../js/drawing/vmlrenderer.js 
 /*----------------------------------------------------------------------------
 VMLRENDERER 1.0
 VML Renderer For RichDraw
 -----------------------------------------------------------------------------
 Created by Mark Finkle (mark.finkle@gmail.com)
 Implementation of VML based renderer.
 -----------------------------------------------------------------------------
 Copyright (c) 2006 Mark Finkle

 This program is  free software;  you can redistribute  it and/or  modify it
 under the terms of the MIT License.

 Permission  is hereby granted,  free of charge, to  any person  obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the  Software without restriction,  including without limitation
 the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 Software is  furnished  to do  so, subject  to  the  following  conditions:
 The above copyright notice and this  permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 DEALINGS IN THE SOFTWARE.
 -----------------------------------------------------------------------------
 Dependencies:
 History:
 2006-04-05 | Created
 --------------------------------------------------------------------------*/


function VMLRenderer() {
	this.base = AbstractRenderer;
}


VMLRenderer.prototype = new AbstractRenderer;


VMLRenderer.prototype.init = function(elem) 
 {
  this.container = elem;
  // this.container.style.overflow = 'hidden';
  this.container.unselectable = "on";
  // Add VML includes and namespace
  elem.ownerDocument.namespaces.add("v", "urn:schemas-microsoft-com:vml");
  var style = elem.ownerDocument.createStyleSheet();
  style.addRule('v\\:*', "behavior: url(#default#VML);");
 }


VMLRenderer.prototype.bounds = function(shape) {
  var rect = new Object();
  rect['x'] = shape.offsetLeft;
  rect['y'] = shape.offsetTop;
  rect['width'] =  shape.offsetWidth;
  rect['height'] = shape.offsetHeight;
  return rect;
}


VMLRenderer.prototype.create = function(shape, fillColor, lineColor, fillOpac, lineOpac, lineWidth, left, top, width, height) {
  var vml;
    var shap=1;
     if (shape == 'rect') {
    vml = this.container.ownerDocument.createElement('v:rect');  
    vml.style.position = 'absolute';
    vml.style.left = left; 
    
    vml.style.top = top;
    vml.style.width = width;
    vml.style.height = height;
    if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor); 
      
    }
    else {
      vml.setAttribute('filled', 'false');
    }
  }
  else if (shape == 'roundrect') {
            vml = this.container.ownerDocument.createElement('v:roundrect'); 
            vml.style.position = 'absolute';
            vml.style.left = left;
            vml.style.top = top;
            vml.style.width = width;    
            vml.style.height = height;
            vml.setAttribute('arcsize', '20%');
            if(fillColor != '') {
              vml.setAttribute('filled', 'true');
              vml.setAttribute('fillcolor', fillColor);
            }
            else {
              vml.setAttribute('filled', 'false');
            }
  }
  else if (shape == 'ellipse') {
    vml = this.container.ownerDocument.createElement('v:oval');  
    vml.style.left = left;
    vml.style.top = top;
    vml.style.width = width; 
    vml.style.height = height;
    vml.style.position = 'absolute';
              if (fillColor != '') {
              vml.setAttribute('filled', 'true');
              vml.setAttribute('fillcolor', fillColor);
            }
            else {
              vml.setAttribute('filled', 'false');
            }
  }
  else if (shape == 'line') {
    vml = this.container.ownerDocument.createElement('v:line'); 
    vml.style.position = 'absolute';
    vml.setAttribute('from', left + 'px,' + top + 'px');
    vml.setAttribute('to', (left+width) + 'px,' + (top+height) + 'px');

  }   
  else if (shape == 'polyline') {
    vml = this.container.ownerDocument.createElement('v:polyline');
    //vml = this.container.ownerDocument.createElement('v:path');    
    //var   thispath=''+xpArray[0]+','+ypArray[0];      
    var thispath='M '+xpArray[1]+', '+ypArray[1]+' l'; 
    var maxcont=xpArray.length;
    for(var conta=2;conta< maxcont;conta++)
     {        
         thispath+=' '+xpArray[conta]+', '+ypArray[conta];
     } 
    //vml.setAttribute("coordsize","800,600");
    vml.setAttribute("points", thispath); 
    //vml.setAttribute("coordorigin","0 0");   
    //vml.setAttribute("coordsize","200 200");
    //vml.setAttribute("path", "m 8,65 l 72,65, 92,11, 112,65, 174,65, 122,100, 142,155, 92,121, 42,155, 60,100 x e;
    //vml.setAttribute("path", "M320 32 c"+ thispath+" z ");     
    //vml.setAttribute("v", "m 10,70 l 85,10,160,70,160,160,10,160 x e");
    if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
    }
    else {
      vml.setAttribute('filled', 'false');
    }
    
  }    
  else if (shape == 'path') 
   {
    vml = this.container.ownerDocument.createElement('v:shape');  
    //vml.setAttribute("top", "300");  
    //vml.setAttribute("left", "200");    
    var thispath2=' ';
    //var   thispath=''+xpArray[0]+','+ypArray[0];      
    var thispath=' '+xpArray[1]+','+ypArray[1]+' l'; 
    var maxcont=xpArray.length;
    for(var conta=2;conta< maxcont;conta++)
     {        
         thispath2+=' '+xpArray[conta]+','+ypArray[conta];
     } 
    //vml.setAttribute("coordsize","800,600");
    //vml.setAttribute("path", thispath); 
    //vml.v.Value ="M320 32 C"+ thispath+"  ";
    //vml.setAttribute("coordorigin","0 0");   
    //vml.setAttribute("coordsize","200 200");
    //vml.setAttribute("path", "m 8,65 l 72,65, 92,11, 112,65, 174,65, 122,100, 142,155, 92,121, 42,155, 60,100 x e;
    var path01 = this.container.ownerDocument.createElement('v:path');  
    path01.setAttribute("v", "m "+thispath+" c"+ thispath2+" e ");  
    vml.style.position="absolute";  
    vml.style.width= 700+"px";
    vml.style.height=500+"px";
    vml.style.left="0px";  
    vml.style.top="0px";    
    vml.setAttribute('coordsize', '700,500'); 
    //vml.setAttribute('margin-left', '300px');  
    //vml.setAttribute('margin-top', '200px');
    //vml.setAttribute("WIDTH", "700px");  
    //vml.setAttribute("HEIGHT", "500px");  
    //vml.setAttribute("coordorigin", "300 -200");   
    //vml.setAttribute("o:bullet","True");
    //vml.setAttribute("path", "M10,70 C 85,10 160,70 160,160 x e"); 
    //var resolution = this.getResolution();    
    // var resolution=33;
    //var size = 800/resolution + " " + (-600/resolution);
    //vml.setAttribute("coordsize", size);
    //vml.setAttribute("textpathok", "true");
    //vml.appendChild('');
    if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
    }
    else {
      vml.setAttribute('filled', 'false');
    }
    
    vml.appendChild(path01)
    
   }
   
   else if (shape == 'controlpath')
   {
    
    vml = this.container.ownerDocument.createElement('v:shape');  
      vml.style.position="absolute";  
    vml.style.width= 700+"px";
    vml.style.height=500+"px";
    vml.style.left=left+"px";  
    vml.style.top=top+"px";  
    vml.setAttribute('coordsize', '700,500');   
     
    var path01 = this.container.ownerDocument.createElement('v:path');  
    path01.setAttribute('v', 'm '+left+','+top+' c'+(left+1)+','+(top+1)+' e ');  

     if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
     }
      else 
     {
      vml.setAttribute('filled', 'false');
     }
    
    vml.appendChild(path01)
    } 


    else if (shape == 'image') {   
    var data =document.forms[0].option_text_message.value;
    vml = this.container.ownerDocument.createElement('v:image'); 
    vml.setAttribute('src',data_image_href);
    vml.style.position="absolute";  
    vml.style.width=100+"px";
    vml.style.height=100+"px";
    vml.style.left=left+"px";  
    vml.style.top=top+"px";  
    vml.style.margin=0+"px";  
    vml.style.padding=0+"px";  
    if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
    }
    else {
      vml.setAttribute('filled', 'false');
    }
    vml.setAttribute('strokeweight', parseFloat(lineWidth)+'px');
   vml.setAttribute('stroked', 'true');  
   vml.setAttribute('strokecolor',lineColor);
   
   
    }
    
    else if (shape == 'text') {   
   
    var data =document.forms[0].option_text_message.value;
    vml = this.container.ownerDocument.createElement('v:shape');
    vml.style.position="absolute";  
    vml.style.width=100+"px";
    vml.style.height=100+"px";
    vml.style.left=left+"px";  
    vml.style.top=top+"px";  
    vml.style.margin=0+"px";  
    vml.style.padding=0+"px";  
    if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
    }
    else {
      vml.setAttribute('filled', 'false');
    }
    vml.setAttribute('strokeweight', parseFloat(lineWidth)+'px');//document.forms[0].linewidth.options[document.forms[0].linewidth.selectedIndex].value+'px');
   vml.setAttribute('stroked', 'true');  
   vml.setAttribute('strokecolor',lineColor);//document.forms[0].linecolor.options[document.forms[0].linecolor.selectedIndex].value);
    //vml.setAttribute('fillcolor', fillColor);  
    vml.setAttribute('path','m 100 100 l 600 100 e'); 
        var textPathObj = this.container.ownerDocument.createElement("v:textpath");
        //textPathObj.setAttribute('style','font:'+document.forms[0].option_text_family.options[document.forms[0].option_text_family.selectedIndex].value+' normal normal '+parseFloat(document.forms[0].option_text_size.value)+'px ');
        textPathObj.setAttribute('string', data);  
        textPathObj.setAttribute('trim', 'false'); 
        textPathObj.setAttribute('fitpath', 'false');
        textPathObj.setAttribute('on','true');  
        
        textPathObj.style.fontFamily=document.forms[0].option_text_family.value;  
        textPathObj.style.fontSize=parseFloat(document.forms[0].option_text_size.value)+'px'; 
         textPathObj.style.vTextKern='true';  
      var pathObj = this.container.ownerDocument.createElement("v:path");
      pathObj.setAttribute('textpathok', 'true');  
        //textPathObj.setAttribute('style','font-family:"Arial Black";font-size:40pt;v-text-kern:t');

 
  /* //vml.setAttribute('coordsize', '700,500'); 
    vml.setAttribute('inset', '0px, 0px, 0px, 0px');
    if (fillColor != '') 
     {
      vml.setAttribute('stroked', 'true');
      vml.setAttribute('fillcolor', fillColor);
     } 
      else 
     {
      vml.setAttribute('stroked', 'false');
     }    
   
    
    var fontObj =this.container.ownerDocument.createElement("font");  
      fontObj.face = document.forms[0].option_text_family.value;
      fontObj.size = parseFloat(document.forms[0].option_text_size.value);   
       fontObj.color = fillColor;  
       fontObj.innerHTML = data;
         
      
 
        
 
     var fillObj = this.container.ownerDocument.createElement("v:fill");
          fillObj.setAttribute('color', fillColor);
          fillObj.setAttribute('on', 'true');
      var lineObj = this.container.ownerDocument.createElement('v:line'); 
    lineObj.style.position = 'absolute';
    lineObj.setAttribute('from', left + 'px,' + top + 'px');
    lineObj.setAttribute('to', (left+100) + 'px,' + (top+0) + 'px');
       */ 
        //textPathObj.style.
       //textPathObj.appendChild(fontObj); 
       
       //fontObj.stroked='true'; 
       
       //strokeObj.strokeweight='7px';
       // strokeObj.color = fillColor;   
       //strokeObj.on='true';
     
       
      //textBoxObj.appendChild(strokeObj);
 
    //vml.appendChild(lineObj); 
    
    vml.appendChild(textPathObj);  
    vml.appendChild(pathObj);  
    
    
  }    
 
  
  if (lineColor != '') {
    vml.setAttribute('stroked', 'true');
    vml.setAttribute('strokecolor', lineColor);
    vml.setAttribute('strokeweight', lineWidth);
    var fill = this.container.ownerDocument.createElement('v:fill'); 
      fill.setAttribute("opacity", parseFloat(fillOpac));
                 vml.appendChild(fill);
    
  }
  else {
    vml.setAttribute('stroked', 'false');  
    var stroke = this.container.ownerDocument.createElement('v:stroke'); 
      stroke.setAttribute("opacity", parseFloat(lineOpac));
                 vml.appendChild(stroke);
  }
  
  
  this.container.appendChild(vml);
  
  return vml;
};  

VMLRenderer.prototype.datacreate = function(fillColor, lineColor, lineWidth, left, top, width, height,data) {
  var vml; 
  var re_split = /[ ,]/;
  vml = this.container.ownerDocument.createElement('v:shape'); 
  var path01 = this.container.ownerDocument.createElement('v:path');  
  // adjust some SVG path commands to VML commands
  var path = data
  path = path.replace(/c/g,'v');
  path = path.replace(/z/g,'x'); //or e?
  // round all decimal points to integers
  // VML does not appear to parse them correctly
  if (path.search(/\./) > -1) 
   {
     pathitems = path.split(re_split);
     for (var i=0; i<pathitems.length; i++) 
      {
         if (isNaN(parseFloat(pathitems[i])) == false)
          {
              pathitems[i] = Math.round(pathitems[i]);
          }
      }
      path = pathitems.join(" ");
   }
  path01.setAttribute("v", path);  
  vml.style.position="absolute";  
  vml.style.width= '21600';//700+"px";
  vml.style.height='21600';//500+"px";
  vml.style.left="0px";  
  vml.style.top="0px";    
  //vml.setAttribute('coordsize',datasplit[0]+','+datasplit[1]);//700,500 
  vml.setAttribute('coordsize', '21600,21600');//('coordsize','700,500');//700,500 
  if (fillColor != '') 
   {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
   }else {
      vml.setAttribute('filled', 'false');
   }    
  vml.appendChild(path01)
  this.container.appendChild(vml);
  return vml;

};   

VMLRenderer.prototype.index = function(shape,order) {  
 
     if(order==-1)
      {
        this.container.appendChild( shape );
      }
      if(order==0){
     
         this.container.insertBefore( shape, shape.parentNode.firstChild );
      } 
 
   if(order==1 || order==2)
    {
         var id=shape.getAttribute('id');
        //alert(id);
        
        
        var numNodes=this.container.childNodes.length;
        //alert(numNodes);
          
        var num=0;
        for(var i = 1; i < numNodes; i++)
         {                                                   
           
           var etiq=this.container.childNodes[i].getAttribute('id');
           if (etiq==id)
            { 
                num=i; 
               
            }                                                    
          } 
          //alert(num);    
          if(order==1) 
           {   
              if((num-1)>=-1)
               {  
                this.container.insertBefore( shape, this.container.childNodes[num-1]);
               } 
           }
          if(order==2){ 
               if((num+1)<numNodes)
               {
                  this.container.insertBefore( shape, this.container.childNodes[num+2]);
               }
          } 
          
    } 
    
    
    
}
VMLRenderer.prototype.remove = function(shape) {
  if(shape!=null){ shape.removeNode(true); }
}

VMLRenderer.prototype.removeAll = function() {  
 while( this.container.hasChildNodes () ){
   this.container.removeChild( this.container.firstChild );
   //this.container.removeNode( this.container.firstChild );
 }
   /*var contshapes =  this.container.childNodes.length;       
    
                          
    var cad=contshapes+'   ';
    for(var i = 0; i < contshapes; i++)
    {                                  
        //alert(i); 
        
        if(this.container.childNodes[i].id) {
             this.container.removeChild(this.container.childNodes[i]);
         }else{
            //cad+=i+'_'+this.svgRoot.childNodes[i].id+' ';
         }
    } 
    //alert(cad);  
*/ 
} 
VMLRenderer.prototype.copy = function(shape) 
 {
   var vml;
   vml =shape.cloneNode(false);
   //vml.setAttribute('fillcolor', "#aa00aa");
   return vml;
 };


VMLRenderer.prototype.paste = function(clipboard,left,top) 
 {
   //var svg;
   //svg =shape;
   
   //clipboard.setAttribute('fillcolor', "#0000aa");
   //clipboard.setAttribute('transform', "translate("+left+","+top+")"); 
   this.container.appendChild(clipboard);
  return clipboard;
 };


VMLRenderer.prototype.duplicate = function(shape) 
 {
   var vml;
   vml =shape.cloneNode(false);
   vml.setAttribute('fillcolor', "#aa00aa");
   this.container.appendChild(vml);
  return vml;
 };

VMLRenderer.prototype.undo = function() 
 {
   this.container.removeChild( this.container.lastChild );
 };
 

var left1=0;;
    var top1=0;   
var pati; 
var pathid, pathini;  
     
VMLRenderer.prototype.move = function(shape, left, top,fromX,FromY) {    
   typeTransform='Translate'; 
         //contmove++;
  if (shape.tagName == 'line') {
    shape.style.marginLeft = left;
    shape.style.marginTop = top;
  } 
   if (shape.tagName == 'polyline') {
    shape.style.marginLeft = left;
    shape.style.marginTop = top;

   }   
   if (shape.tagName == 'oval') {
    shape.style.left = left;
    shape.style.top = top;
  }      
  if (shape.tagName == 'rect') {
    shape.style.left = left;
    shape.style.top = top;
  } 
  
    if (shape.tagName == 'image') {
    shape.style.left = left;
    shape.style.top = top;
  }      
   if (shape.tagName == 'shape') { 
        
       shape.style.left=left+"px";  
        shape.style.top=top+"px";  
    
   }   
      

};


VMLRenderer.prototype.track = function(shape) {
  // TODO
};

VMLRenderer.prototype.clic = function(shape) {
         var end='';
	if(data_path_close==true){end=' ';}

        var thispath='m '+setPoints[0]+' l';  
        var maxcont=setPoints.length;
      
        for(var conta=1;conta< maxcont;conta++){        
          thispath+=setPoints[conta]+' ';
          
	
        }
       	var path=thispath+end+' e';
        shape.style.position="absolute";  
        shape.style.width= 700+"px";
	shape.style.height=500+"px";
        shape.style.left="0px";  
        shape.style.top="0px";    

       
         	shape.children[0].setAttribute("v",path);
               document.forms[0].control_codebase.value=path;
 
}


VMLRenderer.prototype.resize = function(shape, fromX, fromY, toX, toY) {     
 //var vml;
  var deltaX = toX - fromX;
  var deltaY = toY - fromY; 
    var shap=1;
    if (shape.tagName == 'line') { shap=0; }   
   if (shape.tagName == 'polyline') { shap=2; } 
    
  if (shape.tagName == 'line') {
    shape.setAttribute('to', toX + 'px,' + toY + 'px');
  }
  if (shap == 1) {
    if (deltaX < 0) {
      shape.style.left = toX + 'px';
      shape.style.width = -deltaX + 'px';
    }
    else {
      shape.style.width = deltaX + 'px';
    }
  
    if (deltaY < 0) {
      shape.style.top = toY + 'px';
      shape.style.height = -deltaY + 'px';
    }
    else {
      shape.style.height = deltaY + 'px';
    }
  }
   if (shap == 2) {   
        xpArray.push(toX);
        ypArray.push(toY);
	
        //xpArray.push(finetoX);
        //ypArray.push(finetoY);    
    
       var thispath=' '+xpArray[1]+','+ypArray[1];  
       var maxcont=xpArray.length;
       //alert(maxcont);
        for(var conta=2;conta< maxcont;conta++){        
          thispath+=' '+xpArray[conta]+','+ypArray[conta]; 
        }
        //alert(shape.points[1]);
    //shape.setAttribute("points",thispath);       
    shape.points.Value = thispath;
      
        /*
        var thispath=''+xpArray[0]+','+ypArray[0]; 
        var thispatho=new Array();   
        thispatho.push(toX); 
          thispatho.push(toY);
       var maxcont=xpArray.length;
       //alert(maxcont);
        for(var conta=2;conta< maxcont;conta++){        
          thispath+=','+xpArray[conta]+','+ypArray[conta]; 
        }
        //alert(shape.points[1]);
    shape.setAttribute("points",thispath);   
          */
   }
  if(shape.tagName == 'shape')
   {    
          
      if (selectmode == 'controlpath')
     {    
        
                 var end='';
	if(data_path_close==true){end=' ';}

        var thispath='m '+setPoints[0]+' l';  
        var maxcont=setPoints.length;
      
        for(var conta=1;conta< maxcont;conta++){        
          thispath+=setPoints[conta]+' ';
          
	
        }
        var path=thispath+toX+','+toY+end+' e';
 
        shape.style.position="absolute";  
        shape.style.width= 700+"px";
	shape.style.height=500+"px";
        shape.style.left="0px";  
        shape.style.top="0px";    

         	shape.children[0].setAttribute("v",path);
               document.forms[0].control_codebase.value=path;

          
     }
      else
     {  
      
      xpArray.push(toX);
      ypArray.push(toY);
	
        //xpArray.push(finetoX);
        //ypArray.push(finetoY);    
        var thispath2='';
       var thispath1=' '+xpArray[1]+','+ypArray[1];  
       var maxcont=xpArray.length;
       //alert(maxcont);
        for(var conta=2;conta< maxcont ;conta++){        
          thispath2+=''+xpArray[conta]+','+ypArray[conta]+',';
          if((conta+2)%3==0){thispath2+='';} 
        } 
        thispath2+=''+xpArray[maxcont]+','+ypArray[maxcont]+'';   
        
        //alert(shape.points[1]);   
        //appendChild(path01)
       //var path01=shape.getFirstChild();  
       var path01 = this.container.ownerDocument.createElement('v:path');  
       path01.setAttribute("v", "m"+thispath1+" l"+ thispath2+" e"); 
        //shape.margin-left="300px";  
        //shape.margin-top="200px";    
  
      //shape.setAttribute('path','m '+thispath1+ ' c'+thispath2+'  e'); 
       if(shape.children[0].tagName=='textpath')
        {      
                var path01 = this.container.ownerDocument.createElement('v:path');  
                path01.setAttribute("v", 'm 100 100 l 600 100 e'); 

            //if(xpArray.length>1)
             //{       shap.style.position="absolute";  
                    shape.style.width=100+"px";
                    shape.style.height=100+"px";
                    shape.style.left=toX+"px";  
                    shape.style.top=toY+"px";  
                    shape.style.margin=0+"px";  
                    shape.style.padding=0+"px";  
                    shape.appendChild(path01); 
             //}    
        }
         else
        {  
              shape.style.position="absolute";  
          shape.style.width= 700+"px";
	  shape.style.height=500+"px";
          shape.style.left="0px";  
          shape.style.top="0px";    
          //shape.setAttribute('coordsize', '700,500');  
          shape.appendChild(path01);  
          }
        
       //shape.setAttribute('position', 'absolute'); 
       //shape.translate(xpArray[conta+1]+','+ypArray[conta+1]); 
      //shape.setAttribute('coordsize', '700,500');
       // shape.v.Value ='M '+thispath1+ ' C'+thispath2+' x e';      
      //shape.v.Value = 'M '+thispath+ ' c '+thispath2;
      //shape.setAttribute("v", 'M '+thispath+ ' C '+thispath2);  
		//shape.setAttribute('path','M '+thispath+ ' C '+thispath2);
   } 	
  } 
  
};  


VMLRenderer.prototype.tocurve = function() {


};


VMLRenderer.prototype.info = function(shape)
{   
var shInfo = {};
shInfo.id = shape.id;
 shInfo.type = shape.tagName;
 if (shape.tagName == 'rect') 
   {
    shInfo.left = parseFloat(shape.getAttribute( 'x'));
    shInfo.top = parseFloat(shape.getAttribute( 'y'));
    shInfo.width = parseFloat(shape.getAttribute('width'));
    shInfo.height = parseFloat(shape.getAttribute('height'));   
    //++
    //shInfo.rotate = parseFloat(shape.getAttribute('rotation'));  
   }
  else if (shape.tagName == 'oval') 
   {
    shInfo.width = parseFloat(shape.getAttribute('rx'))*2;
    shInfo.height = parseFloat(shape.getAttribute('ry'))*2;   
    shInfo.left = (shInfo.width * 2)  - parseFloat(shape.getAttribute('rx'));
    shInfo.top = (shInfo.height * 2)  - parseFloat(shape.getAttribute('ry'));
 
   }
  else if (shape.tagName == 'roundrect') 
   {
    shInfo.left = parseFloat(shape.getAttribute('x'));
    shInfo.top = parseFloat(shape.getAttribute('y'));
    shInfo.width = parseFloat(shape.getAttribute('width'));
    shInfo.height = parseFloat(shape.getAttribute('height'));   
   
   }
  else if (shape.tagName == 'line') 
   {
    shInfo.left = parseFloat(shape.getAttribute('x1'));
    shInfo.top = parseFloat(shape.getAttribute('y1'));

   } 
  else if (shape.tagName == 'polyline') 
   {
    shInfo.points = shape.getAttribute('points');
   }
   else if (shape.tagName == 'image') 
   {
    shInfo.left = parseFloat(shape.getAttribute('x'));
    shInfo.top = parseFloat(shape.getAttribute('y'));
    shInfo.width = parseFloat(shape.getAttribute('width'));
    shInfo.height = parseFloat(shape.getAttribute('height'));   
    shInfo.src = shape.getAttribute('src');  
   } 
  else 
  
   if (shape.tagName == 'shape')
   {  
       if(shape.children[0].tagName=='path') {
              shInfo.d = shape.getAttribute('v'); 
             document.forms[0].codebase.value=shape.getAttribute('v'); 
             
       }
       if(shape.children[0].tagName=='textpath') {
             shInfo['font-family'] = shape.children[0].getAttribute('font-family')
           shInfo['font-size'] = parseInt(shape.children[0].getAttribute('font-size'))
        shInfo.top = parseFloat(shape.children[0].getAttribute('y'))
        shInfo.left = parseFloat(shape.children[0].getAttribute('x'))
        shInfo.text = shape.textContent

       }
   }
   return shInfo;  
   	
   	
}
VMLRenderer.prototype.transformShape = function(shape,data,transform)
{   
 
 if(shape.tagName == 'rect')
  { 
    
    var box = this.bounds(shape);
    var sdata=data.split(';'); 
    
    //alert(data[0]); 
      shape.style.top = parseFloat(sdata[0]) + 'px';  
      shape.style.left = parseFloat(sdata[1]) + 'px';
      shape.style.width = parseFloat(sdata[2]) + 'px';    
      shape.style.height = parseFloat(sdata[3]) + 'px';
     
      
   
   // var centerx=parseFloat(sdata[0])+parseFloat(box.width/2);
   // var centery=parseFloat(sdata[1])+parseFloat(box.height/2);    
    shape.style.rotation=parseFloat(sdata[4]);
    
   //shape.nodeValue=data;
  }
   else 
 if(shape.tagName == 'text')
  {    
    if(data.indexOf('<;>',0)==-1 )
     {  
      shape.textContent = data;  
     }
      else
     {  
       var sdata=data.split('<;>'); //?????????
       shape.textContent = sdata[0]; 
       shape.setAttribute('font-size',parseFloat(sdata[1])); 
        shape.setAttribute('font-family',sdata[2]);
     }
   //shape.nodeValue=data;
  }
   else
 if (shape.tagName == 'polyline') 
  {
    shape.setAttribute('points',data);
  }
   else 
 if (shape.tagName == 'image') 
  {   
    //alert(data);  
    if(data.indexOf(';',0)==-1 )
     {  
      shape.setAttribute('src',data);
     }
      else
     {  
        var box = this.bounds(shape);
        var sdata=data.split(';');
        shape.style.top = parseFloat(sdata[0]) + 'px';  
        shape.style.left = parseFloat(sdata[1]) + 'px';
        shape.style.width = parseFloat(sdata[2]) + 'px';    
        shape.style.height = parseFloat(sdata[3]) + 'px';
        var centerx=parseFloat(sdata[0])+parseFloat(box.width/2);
        var centery=parseFloat(sdata[1])+parseFloat(box.height/2);    
        shape.style.rotation=parseFloat(sdata[4]);


     } 
      
  }
   else 
 if (shape.tagName == 'path')
  {     
    if(data.indexOf(';',0)==-1 )
     {  
    	//shape.setAttribute( 'd', data);  //????????
    	//shape.setAttribute( 'transform', transform);  
     }
      else
     {  
        var box = this.bounds(shape);
        var sdata=data.split(';');
        var centerx=parseFloat(sdata[0])+parseFloat(box.width/2);
        var centery=parseFloat(sdata[1])+parseFloat(box.height/2);    
        //++shape.setAttribute( 'transform','scale('+parseFloat(sdata[2])+','+parseFloat(sdata[3])+')'+' rotate('+parseFloat(sdata[4])+','+centerx+','+centery+')'+' translate('+parseFloat(sdata[0])+','+parseFloat(sdata[1])+')');


     } 
  }  
   	                   
   	
}
VMLRenderer.prototype.editShape = function(shape,data)
{   
if(shape.tagName == 'text'){
shape.textContent = data
}else
   if (shape.tagName == 'polyline') 
   {
    shape.setAttribute('points',data);
   }
  else 
  
  if (shape.tagName == 'path')
   {
    	shape.setAttribute('v', data);  
    	
   }  
   	 
   	
}
VMLRenderer.prototype.editCommand = function(shape, cmd, value)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (value != '') {
        shape.filled = 'true';
        shape.fillcolor = value;
      }
      else {
        shape.filled = 'false';
        shape.fillcolor = '';
      }
    }
    else if (cmd == 'linecolor') {
      if (value != '') {
        shape.stroked = 'true';
        shape.strokecolor = value;
      }
      else {
        shape.stroked = 'false';
        shape.strokecolor = '';
      }
    }
    else if (cmd == 'linewidth') {
      shape.strokeweight = parseInt(value) + 'px';
    } 
     else if (cmd == 'fillopacity') {
           
             shape.fill.opacity= parseFloat(value);
            //shape.style.fill.setAttribute("opacity", parseFloat(value)); 
      
    }
  }
}


VMLRenderer.prototype.queryCommand = function(shape, cmd)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (shape.filled == 'false')
        return '';
      else
        return shape.fillcolor;
    }
    else if (cmd == 'linecolor') {
      if (shape.stroked == 'false')
        return '';
      else
        return shape.strokecolor;
    }
    else if (cmd == 'linewidth') {
      if (shape.stroked == 'false') {
        return '';
      }
      else {
        // VML always transforms the pixels to points, so we have to convert them back
        return (parseFloat(shape.strokeweight) * (screen.logicalXDPI / 72)) + 'px';
      }
    }
  }
}



VMLRenderer.prototype.showMultiSelect = function(iniX,iniY) { 
  var tracker = document.getElementById('trackerMultiSelect');
  if (tracker) {
    this.remove(tracker);
  } 
  var coord=$('xyinput').innerHTML.split(',');
	toX=parseFloat(coord[0]);
	toY=parseFloat(coord[1]); 
	
   tracker = this.container.ownerDocument.createElement('v:rect');
  
  tracker.style.position = 'relative';
  tracker.style.left = iniX;
  tracker.style.top = iniY;
  tracker.style.width = toX ;
  tracker.style.height = toY;
  tracker.setAttribute('filled', 'false');
  tracker.setAttribute('stroked', 'true');
  tracker.setAttribute('strokecolor', 'blue');
  tracker.setAttribute('strokeweight', '1px');    
  
  this.container.appendChild(tracker);    
}

VMLRenderer.prototype.showNodesCurve = function(path){
  var points=path.split('c');
     var chain='';
     var segment=' ';
     var numpoints=points.length-1;
     for(var a=1;a<numpoints;a++)
      {   
        segment=points[a].split(' ');
         chain+=segment[0]+' ';       
      } 
      
         $('someinfo').value=numpoints+ ' nodes ';
    return chain;    
        
};



VMLRenderer.prototype.showTracker = function(shape) {
  var box = this.bounds(shape);
  var trshape = parseFloat(shape.getAttribute('rotation'));  
  var tracker = document.getElementById('tracker');
  if (tracker) {
    this.remove(tracker);
  }
  
  if (shape.tagName == 'shape') 
   { 
      shap=2; 
      if(shape.children[0].tagName == 'path') 
       {
      
            /* $('option_path_trx').value= box.x;  
             $('option_path_try').value= box.y;
             $('option_path_sclx').value= box.width;   
             $('option_path_scly').value= box.height; 
             $('option_path_rot').value= shape.style.rotation;
             */  
             var path=shape.children[0].getAttribute('v');
              $('control_codebase').value=path;
       }        
   }     
  if (shape.tagName == 'rect') { 
     
     $('option_rect_rot').value= shape.getAttribute('rotation');
     $('option_rect_trx').value= box.x;  
     $('option_rect_try').value= box.y;
     $('option_rect_sclx').value= box.width;  
     $('option_rect_scly').value= box.height;

  }  

  if (shape.tagName == 'image'){
  /*  $('option_img_trx').value= box.x; 
    $('option_img_try').value= box.y;
    $('option_img_sclx').value= box.width;  
    $('option_img_scly').value= box.height;
    $('option_img_rot').value= T.b* (Math.PI * 2 / 360);   
      */
  }
  if (shape.tagName == 'text'){
   /* f$('option_text_trx').value= box.x; 
    $('option_text_try').value= box.y;
    $('option_text_sclx').value= box.width;  
    $('option_text_scly').value= box.height;
    $('option_text_rot').value= T.b* (Math.PI * 2 / 360);
   */
  }
  if (shape.tagName == 'line'){ 
    /*
    $('option_line_trx').value= box.x;  
    $('option_line_try').value= box.y;
    */
  }   
  if (shape.tagName == 'oval'){  
    /*$('option_ellipse_trx').value= putx;  
    $('option_ellipse_try').value= puty;
    $('option_ellipse_sclx').value= box.width;  
    $('option_ellipse_scly').value= box.height;
    $('option_ellipse_rot').value= T.b* (Math.PI * 2 / 360);
    */
  }
  
  
  
 /*var matrix = shape.getScreenCTM();
  var trshape= shape.getAttribute('transform');  
  var shap=1;
  if (shape.tagName == 'path') { shap=2; 
        
        
        
  }
  */  
  //if (shape.getAttribute('transform') ) { shap=2; } 
  //var svgNamespace = 'http://www.w3.org/2000/svg';
  
   tracker = this.container.ownerDocument.createElement('v:group');
   tracker.id = 'tracker'; 
  //tracker.setAttribute('rotation',trshape);
  tracker.setAttribute('coordorigin','0, 0');
  //tracker.setAttribute('wrapcoords',true);
 
   
  tracker.setAttribute('coordsize',box.width+','+ box.height);
  tracker.style.position = 'absolute';   
  tracker.style.left = box.x ;
  tracker.style.top = box.y;
  tracker.style.width = box.width ;
  tracker.style.height = box.height ;
       
        
        
        
        
   
    
    
    
    ////////////////

 /*
       
       var trshape='translate (0,0) rotate(0) translate(0,0) '; 
       var trshape_split=trshape.split(') ');    
       
      // get_between (trshape, s1, s2) ;
     if(shape.getAttribute('transform')){ 
         var trshape=shape.getAttribute('transform') ;   
         //var spl=trshape.replace(', ',' ');  
         //var spl1=spl.replace(')',' ');    
         var trshape_split=trshape.split(') '); 
         

    }
  */
                                         
 var corners = [];
  var point = createPoint(box.x, box.y, box.width, box.height);
 //point = {x:box.x, y:box.y, width: box.width, height:box.height};
//point = createPoint(box.x, box.y, box.width, box.height);    
  //1
  corners.push( createPoint(box.x + box.width, box.y, box.width, box.height) );
  point.x = box.x + box.width;
  point.y = box.y;
  //2
  corners.push( createPoint(box.x + box.width, box.y + box.height, box.width, box.height) );
  point.x = box.x + box.width;
  point.y = box.y + box.height;
  //3
  //corners.push( point.matrixTransform(matrix) );
  corners.push( createPoint(box.x , box.y + box.height, box.width, box.height) );
  point.x = box.x;
  point.y = box.y + box.height;
  //4
  corners.push( createPoint(box.x + box.width, box.y, box.width, box.height) );   
  
  var max = createPoint(corners[0].x, corners[0].y);
  var min = createPoint(corners[0].x, corners[0].y);

  // identify the new corner coordinates of the
  // fully transformed bounding box
  
  for (var i = 1; i < corners.length; i++) {
    var x = corners[i].x;
    var y = corners[i].y;
    if (x < min.x) {
      min.x = x;
    }
    else if (x > max.x) {
      max.x = x;
    }
    if (y < min.y) {
      min.y = y;
    }
    else if (y > max.y) {
      max.y = y;
    }
  } 
      
      
 var border_square = this.container.ownerDocument.createElement('v:rect');
  
  border_square.style.position = 'relative';
  border_square.style.left = 0 - 10;
  border_square.style.top = 0 - 10;
  border_square.style.width = box.width + 20;
  border_square.style.height = box.height + 20;
  border_square.setAttribute('filled', 'false');
  border_square.setAttribute('stroked', 'true');
  border_square.setAttribute('strokecolor', 'blue');
  border_square.setAttribute('strokeweight', '1px');  
  
  
  var border_angle = this.container.ownerDocument.createElement('v:polyline');  
  border_angle.style.position = 'relative';
 
    //border_angle.setAttribute('from',(box.width+10) + 'px,' + (box.height/2) + 'px');
   //border_angle.setAttribute('to', (box.width+10+25) + 'px,' + (box.width+10) + 'px');
  border_angle.setAttribute('filled', 'false');
  border_angle.setAttribute('stroked', 'true');
  border_angle.setAttribute('strokecolor', 'blue');
  border_angle.setAttribute('strokeweight', '1px'); 
  border_angle.setAttribute("points", (box.width+10)+","+((box.height/2))+", "
                                      +(box.width+10+25)+","+((box.height/2)) );
                  
      
    /* var path01 = this.container.ownerDocument.createElement('v:path');  
     //path01.setAttribute("v", "m "+thispath+" c"+ thispath2+" e ");  
     path01.setAttribute("v", "m"+(min.x-10)+","+ (min.y-10)+" r"+(box.width+20)+","+(0)+" r"+(0)+","+(box.height+20)+" r"+(-box.width-20)+','+(0)+"x e m"+(box.x+box.width+10)+","+ (box.y+(box.height/2))+" r"+(25)+",0  e ");
     border.appendChild(path01)
    */ 
     //border.setAttribute('stroke-width', '1'); 
       
// createRect(min.x, min.y, max.x - min.x, max.y - min.y);
  
  
 /* tracker = this.container.ownerDocument.createElement('v:rect');
  tracker.id = 'tracker';
  tracker.style.position = 'absolute';
  tracker.style.left = box.x - 10;
  tracker.style.top = box.y - 10;
  tracker.style.width = box.width + 20;
  tracker.style.height = box.height + 20;
  tracker.setAttribute('filled', 'false');
  tracker.setAttribute('stroked', 'true');
  tracker.setAttribute('strokecolor', 'blue');
  tracker.setAttribute('strokeweight', '1px');
  this.container.appendChild(tracker);
 */
     var circle1 = this.container.ownerDocument.createElement('v:oval'); 
      circle1.style.position = 'relative'; 
        circle1.style.left = ( (box.width+40)-5);
    circle1.style.top = ( (box.height / 2) -5);
    circle1.style.width = (10);
    circle1.style.height = (10);
    circle1.setAttribute('filled', 'true');
   circle1.setAttribute('stroked', 'true'); 
   circle1.setAttribute('fillcolor', '#ffffff');
   circle1.setAttribute('strokecolor', 'green');
   circle1.setAttribute('strokeweight', '1px');

   
  var rect1 = this.container.ownerDocument.createElement('v:rect');
  rect1.style.position = 'relative';
  rect1.style.left =  - 10-5;
  rect1.style.top =  - 10-5;
  rect1.style.width = 10;
  rect1.style.height = 10;
  rect1.setAttribute('filled', 'true');
  rect1.setAttribute('stroked', 'true'); 
  rect1.setAttribute('fillcolor', '#ffffff');
  rect1.setAttribute('strokecolor', 'green');
  rect1.setAttribute('strokeweight', '1px');

    
  var rect2 = this.container.ownerDocument.createElement('v:rect');
  rect2.style.position = 'relative';
  rect2.style.left =   box.width +5;
  rect2.style.top = -10 -5;
  rect2.style.width = 10;
  rect2.style.height = 10;
  rect2.setAttribute('filled', 'true');
  rect2.setAttribute('stroked', 'true'); 
  rect2.setAttribute('fillcolor', '#ffffff');
  rect2.setAttribute('strokecolor', 'green');
  rect2.setAttribute('strokeweight', '1px');

                                                        
  var rect3 = this.container.ownerDocument.createElement('v:rect');
  rect3.style.position = 'relative';
  rect3.style.left =   box.width+5;
  rect3.style.top =  box.height+5;
  rect3.style.width = 10;
  rect3.style.height = 10;
  rect3.setAttribute('filled', 'true');
  rect3.setAttribute('stroked', 'true'); 
  rect3.setAttribute('fillcolor', '#ffffff');
  rect3.setAttribute('strokecolor', 'green');
  rect3.setAttribute('strokeweight', '1px');
   
  var rect4 = this.container.ownerDocument.createElement('v:rect');
  rect4.style.position = 'relative';
  rect4.style.left =  -10-5;
  rect4.style.top = box.height+5;
  rect4.style.width = 10;
  rect4.style.height = 10;
  rect4.setAttribute('filled', 'true');
  rect4.setAttribute('stroked', 'true'); 
  rect4.setAttribute('fillcolor', '#ffffff');
  rect4.setAttribute('strokecolor', 'green');
  rect4.setAttribute('strokeweight', '1px');
 
 
 
  var rectmid12 = this.container.ownerDocument.createElement('v:rect');
  rectmid12.style.position = 'relative';
  rectmid12.style.left = (box.width/2) -5;
  rectmid12.style.top =- 10-5;
  rectmid12.style.width = 10;
  rectmid12.style.height = 10;
  rectmid12.setAttribute('filled', 'true');
  rectmid12.setAttribute('stroked', 'true'); 
  rectmid12.setAttribute('fillcolor', '#ffffff');
  rectmid12.setAttribute('strokecolor', 'green');
  rectmid12.setAttribute('strokeweight', '1px');

 var rectmid23 = this.container.ownerDocument.createElement('v:rect');
  rectmid23.style.position = 'relative';
  rectmid23.style.left = box.width +5;
  rectmid23.style.top = (box.height/2)-5;
  rectmid23.style.width = 10;
  rectmid23.style.height = 10;
  rectmid23.setAttribute('filled', 'true');
  rectmid23.setAttribute('stroked', 'true'); 
  rectmid23.setAttribute('fillcolor', '#ffffff');
  rectmid23.setAttribute('strokecolor', 'green');
  rectmid23.setAttribute('strokeweight', '1px');

 var rectmid34 = this.container.ownerDocument.createElement('v:rect');
  rectmid34.style.position = 'relative';
  rectmid34.style.left = (box.width/2)-5;
  rectmid34.style.top = box.height+5;
  rectmid34.style.width = 10;
  rectmid34.style.height = 10;
  rectmid34.setAttribute('filled', 'true');
  rectmid34.setAttribute('stroked', 'true'); 
  rectmid34.setAttribute('fillcolor', '#ffffff');
  rectmid34.setAttribute('strokecolor', 'green');
  rectmid34.setAttribute('strokeweight', '1px');

 
 var rectmid41 = this.container.ownerDocument.createElement('v:rect');
  rectmid41.style.position = 'relative';
  rectmid41.style.left =  -10-5 ;
  rectmid41.style.top =(box.height/2)-5;
  rectmid41.style.width = 10;
  rectmid41.style.height = 10;
  rectmid41.setAttribute('filled', 'true');
  rectmid41.setAttribute('stroked', 'true'); 
  rectmid41.setAttribute('fillcolor', '#ffffff');
  rectmid41.setAttribute('strokecolor', 'green');
  rectmid41.setAttribute('strokeweight', '1px');
 
       
  

     var colorin="#ff0000";
      var colorout="#ffffff" 
      
        circle1.attachEvent("onmouseover", function(event) {circle1.style.cursor= 's-resize';  circle1.setAttribute('fillcolor', colorin ); typeTransform='Rotate'; scaleType='nw'; }, false);
     circle1.attachEvent("onmouseout", function(event) {circle1.style.cursor= 'default';  circle1.setAttribute('fillcolor', colorout ); typeTransform='Rotate'; }, false); //typeTransform='rotate'
 
      
     rect1.attachEvent("onmouseover", function(event) {rect1.style.cursor= 'nw-resize';  rect1.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='nw';  }, false);
     rect1.attachEvent("onmouseout", function(event) {rect1.style.cursor= 'default';  rect1.setAttribute('fillcolor', colorout ); typeTransform='Scale';  }, false); //typeTransform='rotate'
    
     rect2.attachEvent("onmouseover", function(event) {rect2.style.cursor= 'ne-resize';  rect2.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='ne';}, false);  
     rect2.attachEvent("onmouseout", function(event) {rect2.style.cursor= 'default';  rect2.setAttribute('fillcolor', colorout ); typeTransform='Scale'; }, false);
      
     rect3.attachEvent("onmouseover", function(event) {rect3.style.cursor= 'se-resize';  rect3.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='se';}, false);  
     rect3.attachEvent("onmouseout", function(event) {rect3.style.cursor= 'default';  rect3.setAttribute('fillcolor', colorout ); typeTransform='Scale'; }, false);
     
     rect4.attachEvent("onmouseover", function(event) {rect4.style.cursor= 'sw-resize';  rect4.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='sw';}, false);  
     rect4.attachEvent("onmouseout", function(event) {rect4.style.cursor= 'default';  rect4.setAttribute('fillcolor', colorout ); typeTransform='Scale'; }, false);
                                                    
     rectmid12.attachEvent("onmouseover", function(event) {rectmid12.style.cursor= 'n-resize';  rectmid12.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='n';}, false);  
     rectmid12.attachEvent("onmouseout", function(event) {rectmid12.style.cursor= 'default';  rectmid12.setAttribute('fillcolor', colorout ); typeTransform=''; }, false); 

     rectmid23.attachEvent("onmouseover", function(event) {rectmid23.style.cursor= 'e-resize';  rectmid23.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='e';}, false);  
     rectmid23.attachEvent("onmouseout", function(event) {rectmid23.style.cursor= 'default';  rectmid23.setAttribute('fillcolor', colorout ); typeTransform=''; }, false); 
     
     rectmid34.attachEvent("onmouseover", function(event) {rectmid34.style.cursor= 's-resize';  rectmid34.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='s';}, false);  
     rectmid34.attachEvent("onmouseout", function(event) {rectmid34.style.cursor= 'default';  rectmid34.setAttribute('fillcolor', colorout ); typeTransform=''; }, false); 

     rectmid41.attachEvent("onmouseover", function(event) {rectmid41.style.cursor= 'w-resize';  rectmid41.setAttribute('fillcolor', colorin ); typeTransform='Scale'; scaleType='w'; }, false);  
     rectmid41.attachEvent("onmouseout", function(event) {rectmid41.style.cursor= 'default';  rectmid41.setAttribute('fillcolor', colorout ); typeTransform=''; }, false); 
   //tracker.setAttribute('transform',trshape); 

 
 
  tracker.appendChild(border_square); 
  tracker.appendChild(border_angle);  
   
  tracker.appendChild(circle1);  
  
  tracker.appendChild(rect1);    
  tracker.appendChild(rect2);   
  tracker.appendChild(rect3); 
  tracker.appendChild(rect4);    
  tracker.appendChild(rectmid12);  
  tracker.appendChild(rectmid23);
  tracker.appendChild(rectmid34);
  tracker.appendChild(rectmid41);  
  
  /*
   
  
 
  */


   this.container.appendChild(tracker);



}                                      










VMLRenderer.prototype.getMarkup = function() { 
       
  return this.container.innerHTML;
}



/////////////////////////////////



var rotatexxx=0; 
 
var scaleType=''; 
var xrot=0;
var yrot=0;  

var point = {x:0, y:0, width: 0, height:0};

function createPoint (x, y, width, height) {
    //var point = {x:34, y:22, width: 22, height:23};
    //point.x = x;
    //point.y = y;   
    point = {x:x, y:y, width: width, height:height};
    return point;
  }


/////////////////////////////////

VMLRenderer.prototype.restruct= function(shape)
{
};        



VMLRenderer.prototype.transform = function() {

};

VMLRenderer.prototype.scaleShape = function(shape, previus,toX, toY) {
// document.forms[0].code.value="escala";      

         //document.forms[0].code.value="escala"; 
          var box = this.bounds(shape);
	 var prevbox=this.bounds(previus);
	var centerx= box.x+(box.width/2);
	var centery= box.y+(box.height/2); 
	var coord=$('xyinput').innerHTML.split(',');
	toX=parseFloat(coord[0]);
	toY=parseFloat(coord[1]); 
	var d2p_center=dist2p(centerx,centery,toX,toY);       

	var d2p=dist2p(box.x,box.y,toX,toY);

	var shareScale=box.width/d2p;

	var trans_ShareScale='';
	var tx, ty, tw, yh;

	if(scaleType.length==1){
		if(scaleType== 'w')
		 {
			trans_ShareScale=shareScale+",1";  
			tx=toX; 
			ty=prevbox.y; 
			var dist=prevbox.x-toX;
			var w=dist+prevbox.width;
			if(w<1){w=1;}
			tw=w;
			th=prevbox.height;
			//document.forms[0].code.value=box.x+' '+toX+' '+dist+''; 
		 }        
		if(scaleType== 'e')
		 {
		        trans_ShareScale=shareScale+",1"; 
			tx=prevbox.x; 
			ty=prevbox.y; 
			var dist=toX-(prevbox.x+prevbox.width); //dist2p(toX,b,c,d);
			var w=dist+prevbox.width;
			if(w<1){w=1;}
			tw=w;
			th=prevbox.height;
 
		 }        
		if(scaleType== 'n')
		 {
			trans_ShareScale="1,"+shareScale; 
			
			tx=prevbox.x; 
			ty=toY; 
			var dist=prevbox.y-toY;
			var h=dist+prevbox.height;
			if(h<1){h=1;}
			tw=prevbox.width;
			th=h;

		 }
                if( scaleType== 's')
                 {
                        trans_ShareScale="1,"+shareScale;  

			tx=prevbox.x; 
			ty=prevbox.y; 
			var dist=toY-(prevbox.y+prevbox.height); //dist2p(toX,b,c,d);
			var h=dist+prevbox.height;
			if(h<1){h=1;}
			tw=prevbox.width;
			th=h;

	         }
        }
	if(scaleType.length==2){
		if(scaleType== 'nw'){
			trans_ShareScale=shareScale+","+shareScale; 
          
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
      			  var angle_diagonal=ang2v(prevbox.x,prevbox.y,prevbox.x+prevbox.width,prevbox.y+prevbox.height)
            
                        var ax= prevbox.x;
                        var ay= prevbox.y;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y+prevbox.height; 
                        
                        var cx= toX;
                        var cy= toY;
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2)); 
                      var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy); 
                 document.forms[0].code.value=angle_diagonal* 180 / Math.PI;       

                var tx= section_a[1];
                var ty= section_a[2];
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x+prevbox.width; 
                        var cy= prevbox.y;

                        var dx= prevbox.x+prevbox.width;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);

                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1] 
                        var by= 0; 
                        
                        var cx= prevbox.x; 
                        var cy= prevbox.y+prevbox.height; 

                        var dx= 0; 
                        var dy= prevbox.y+prevbox.height;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);

                var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
                
                  
 

                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        //document.forms[0].code.value=distx+' '+disty;
			tw=distx;
			th=disty;

			
		}                  
		
	//////////////////// SE
		
           if( scaleType== 'se'){
			trans_ShareScale=shareScale+","+shareScale;   
			
	          
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
       			var angle_diagonal=ang2v(prevbox.x,prevbox.y,prevbox.x+prevbox.width,prevbox.y+prevbox.height)
		
			
			
                        var ax= prevbox.x;
                        var ay= prevbox.y;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y+prevbox.height; 
                        
                        var cx= toX;
                        var cy= toY;   
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2)); 
      
                var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);   
                
                                         

                //////////
                var tx= prevbox.x;
                var ty= prevbox.y;
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x; 
                        var cy= prevbox.y;

                        var dx= prevbox.x;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               /////////////////
               
               
                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         

             
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1] 
                        var by= 0; 
                        
                        var cx= prevbox.x; 
                        var cy= prevbox.y; 

                        var dx=0;
                        var dy= prevbox.y;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               ///////////////
               
                var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
                
   
                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        
			tw=distx;
			th=disty;

			
		}

		if(scaleType== 'ne'){  
		        
			trans_ShareScale=shareScale+","+shareScale;   
			
	                var angle_diagonal=ang2v(prevbox.x,prevbox.y+prevbox.height,prevbox.x+prevbox.width,prevbox.y)
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
 		
			
				
			
                        var ax= prevbox.x;
                        var ay= prevbox.y+prevbox.height;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y;
                       
                        var cx= toX;
                        var cy= toY;   
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2)); 


                      document.forms[0].code.value=angle_diagonal;

      
                var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);   
                
                                         

                //////////
                var tx= prevbox.x;
                var ty= section_a[2];
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x; 
                        var cy= prevbox.y;

                        var dx= prevbox.x;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               /////////////////
               
               
                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         

             
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1]; 
                        var by= 0; 
                        
                        var cx= prevbox.x; 
                        var cy= prevbox.y+prevbox.height; 

                        var dx=0;
                        var dy= prevbox.y+prevbox.height;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
               
               ///////////////
               
                var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
                

                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        //document.forms[0].code.value=distx+' '+disty;
			tw=distx;
			th=disty;
			
			
			
			
			
		}
		if(scaleType== 'sw'){
			trans_ShareScale=shareScale+","+shareScale;  
			
			
				
			
	                var angle_diagonal=ang2v(prevbox.x,prevbox.y+prevbox.height,prevbox.x+prevbox.width,prevbox.y)
      			//var angle_diagonal=getAngle(prevbox.width,prevbox.height);
 		
			
				
			
                        var ax= prevbox.x;
                        var ay= prevbox.y+prevbox.height;
                        var bx= prevbox.x+prevbox.width; 
                        var by= prevbox.y;
                       
                        var cx= toX;
                        var cy= toY;   
                        var dx= toX+10*Math.cos(angle_diagonal+(Math.PI/2)); 
                        var dy= toY+10*Math.sin(angle_diagonal+(Math.PI/2)); 


                      document.forms[0].code.value=angle_diagonal;

      
                var section_a=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);   
                

                //////////
                var tx= section_a[1];
                var ty= prevbox.y;
                
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= 0;
                        var by= section_a[2] ; 
                        
                        var cx=prevbox.x+prevbox.width; 
                        var cy= prevbox.y+prevbox.height;

                        var dx= prevbox.x+prevbox.width;  
                        var dy= 0;
                        
                      
                var section_b=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
                var distx=dist2p(section_a[1],section_a[2],section_b[1],section_b[2]);         

               /////////////////             
                        var ax= section_a[1];
                        var ay= section_a[2];
                        var bx= section_a[1];
                        var by= 0; 
                          
                        var cx= prevbox.x; 
                        var cy= prevbox.y; 

                        var dx=0;
                        var dy= prevbox.y;
                        
                      
                var section_c=ntrsccn2rb(ax,ay,bx,by,cx,cy,dx,dy);
                  var disty=dist2p(section_a[1],section_a[2],section_c[1],section_c[2]);         
              ///////////////
                
   
                    
                        if(distx<1){distx=1;}    
			
         		
			if(disty<1){disty=1;}
                        //document.forms[0].code.value=distx+' '+disty;
			tw=distx;
			th=disty;
			
		}

	}  



 if(shape.tagName == 'rect')
  { 
    //alert(data[0]); 
    
    
      shape.style.left = tx + 'px';
      shape.style.top = ty + 'px'; 
      shape.style.height = th + 'px';
      shape.style.width = tw + 'px';
    
  }
   else 
 if(shape.tagName == 'text')
  {
    /*
    shape.setAttribute('x',tx);
    shape.setAttribute('y',ty);   
    shape.setAttribute('width', tw);     
    shape.setAttribute('height', th); 
    
    //previus.setAttribute('transform', "scale("+trans_ShareScale+")");
     shape.setAttribute('x', tx + 'px');
    shape.setAttribute('y', ty + 'px');

    shape.setAttribute('textLength', parseInt(Math.round(tw)));    
    
     */
  } 
   else 
 if(shape.tagName == 'oval')
  {
    //shape.getAttribute('transform)
   
      shape.style.left = tx + 'px';
      shape.style.top = ty + 'px'; 
      shape.style.height = th + 'px';
      shape.style.width = tw + 'px';
 
        
  }
   else 
 if(shape.tagName == 'line')
  { 
       shape.setAttribute('to',tx + 'px,' + ty + 'px'); 
           shape.setAttribute('from', tw + 'px,' + th + 'px');
   
         
  }
   else
 if (shape.tagName == 'polyline') 
  {
   
  }
   else 
 if (shape.tagName == 'image') 
  {   
     
      shape.style.left = tx + 'px';
      shape.style.top = ty + 'px'; 
      shape.style.height = th + 'px';
      shape.style.width = tw + 'px';
      
  }
   else 
 if (shape.tagName == 'shape')
  {     

      shape.style.left = tx + 'px';
      shape.style.top = ty + 'px'; 
      shape.style.height = th + 'px';
      shape.style.width = tw + 'px';

       //document.forms[0].code.value='';
       //shape.setAttribute('transform', "scale("+trans_ShareScale+")");

  }  
   	                             

 
         
         
};  



VMLRenderer.prototype.rotateShape = function(shape, previus,toX, toY) {
 
 
 
         //document.forms[0].code.value=$('xyinput').innerHTML;  
    //document.getElementById('richdraw').style.cursor='e-resize';
         var box = this.bounds(shape);
	 var prevbox=this.bounds(previus);
	var centerx= box.x+(box.width/2);
	var centery= box.y+(box.height/2); 
	var coord=$('xyinput').innerHTML.split(',');

       var actual_angle=ang2v(centerx,centery,coord[0], coord[1]);
       
       if(xrot<toX) { rotatexxx+=1;}else{rotatexxx-=1;}
       xrot=toX;
       yrot=toY;  
       
	var xtr=0;
        var ytr=0;
                
        //var box= shape.getBBox();  
        var tr1x=  box.x;  
         var tr1y=  box.y;

 
 
    toX+=xtr;
        toY+=xtr;

      //var trax=parseFloat(toX-box.x);   var tray= parseFloat(toY-box.y);      
      var trax=parseFloat(box.x/2);   var tray= parseFloat(box.y/2); 
       var angler=Math.atan2(toX,toY);
         var angle=angler*180/Math.PI;  
         // var T = shape.getCTM(); 
          //var rotini=T.a*(180 / Math.PI);
           //var angle=rotini*180/Math.PI;
          //var rot_angle=actual_angle*180/Math.PI;  
          //document.forms[0].code.value=centerx+' '+centery+' '+coord[0]+' '+coord[1]+'____ '+rot_angle+' '+actual_angle*180/Math.PI;
          
          
         // matrix( a, b, c, d, e, f )
         // a c e
         // b d f
         // 0 0 1
         //a scale factor of 2, a rotation of 30 deg and a translation of (500,50)
         //T     1.732   -1   500     1   1.732   50     0   0   1
         //T      1  ad-bc      d  -c -de+cf   -b  a  be-df    0   0   1
         
         //shape.setAttribute('transform', "translate("+(-xshe)+","+(-yshe)+")");
 
         // shape.setAttribute("transform", "  matrix( a, b, c, d, e, f )");
          // shape.setAttribute('transform', "translate("+(box.x+(box.width/2))+","+(box.y+(box.height/2))+")  rotate("+rotatexxx+") ");
           //shape.setAttribute('transform', "translate("+(box.x+(box.width/2))+","+(box.y+(box.height/2))+") rotate("+rotatexxx+") translate("+(-box.x-(box.width/2))+","+(-box.y-(box.height/2))+") ");
         //shape.setAttribute('transform', "rotate("+rotatexxx+","+(box.x+(box.width/2))+","+(box.y+(box.height/2))+")");
         //shape.setAttribute('transform', "rotate("+rotatexxx+","+(prevbox.x+(prevbox.width/2))+","+(prevbox.y+(prevbox.height/2))+")");
         //shape.setAttribute('rotation', rot_angle);
         shape.setAttribute('rotation', angle);
         //(prevbox.x+(prevbox.width/2))+","+(prevbox.y+(prevbox.height/2))+")");
                          
 
 
    }

//////////////////////////////
/*H  = 0;
W  = 0;
LX = new Array();
S  = new Array();
i  = 0;
b  = true;

function SVG2VML(i){
	l = L[i];
	if(l.indexOf(" d=")>0){
		p = l.indexOf("fill:")+6;
		C = l.substring(p,p+7);
		p = l.indexOf(" d=")+4;
		q = l.lastIndexOf("z")-1;
		l = l.substring(p,q);
		l = l.replace(/M/g,"m");
		l = l.replace(/c/g,"v");
		l = l.replace(/l/g,"r");
		S = l.split(" ");
		l="";
		for(var j in S){
			c = S[j];
			p = c.substring(0,1);
			d = p>"9"?p:"";
			n = Math.round(c.substring(d!="") * 100);
			l+= (d+n+" ");
		}
		LX[i] = l;
		code = '<v:shape coordsize="'+(W*100)+','+(H*100)+'" class=vml strokeweight="2" strokecolor="'+C+'" filled="false" fillcolor = "'+C+'"/>';
		VML.insertAdjacentHTML("beforeEnd",code);
	} else {
		L[i] = LX[i] = ""
		VML.insertAdjacentHTML("beforeEnd","<span></span>");
	}
}
*/
//http://msdn2.microsoft.com/en-us/library/bb263897(VS.85).aspx
//http://www.w3.org/TR/NOTE-VML
//http://trac.openlayers.org/changeset/5285
//http://vectorconverter.sourceforge.net/index.html
//http://www.dhteumeuleu.com/colorsyntax/viewJS.php?src=svg2vml1.html
 //JS File: ../js/ui/statusbar.js 
 (function(){

var xy = new Ext.Toolbar.TextItem('0, 0');

Ax.setDrawXY = function(x,y){
Ext.fly(xy.getEl()).update([x,y].join(", "));
}

Ax.CanvasStatusbar = ({
    defaultText: 'Ready',
    defaultIconCls: '',
    items: [
     xy,"-",
	{
		iconCls: "x-tbar-page-first",
		tooltip: "Go to first frame"
	},{
        iconCls: "x-tbar-page-prev",
		tooltip: "Go to previous frame"
    },
	"-",
	"Frame <input type=\"text\" style=\"width: 30px\" value=\"0\"> of 1",
	"-",
	{
		iconCls: "x-tbar-page-next",
		tooltip: "Go to next frame"
	},{
		iconCls: "x-tbar-page-last",
		tooltip: "Go to last frame"
	},'-',{
	text: "More",
	menu: [{text : "sum stuff"}]
	}, " "]
})


Ax.PreviewStatusbar = ({
    defaultText: 'Uh... Something',
    defaultIconCls: '',
    items: [{
        text: 'A&nbsp;Buttozn'
    }, '-', 'Revisions'," "]
})

})()

//Simple Status Function

Ax.setStatus = function(status){
//if(!status.anim){status.anim=false}; //a little hack to stop those this.statusEl is undefined errors
//oh. crap. that doesn't work :(

Ax.viewport.findById("canvas").getBottomToolbar().setStatus(status)
Ax.viewport.findById("preview").getBottomToolbar().setStatus(status)
}
Ax.showBusy = function(){
Ax.viewport.findById("canvas").getBottomToolbar().showBusy()
Ax.viewport.findById("preview").getBottomToolbar().showBusy()
}


 //JS File: ../js/ui/history.js 
 /*
Grid for History panel
*/

 Ax.History = Ext.extend(Ext.grid.GridPanel, {
 initComponent:function() {
 Ext.apply(this, {
 store: new Ext.data.SimpleStore({
 id:0,
 fields:[
 {name: 'id', type: 'float'},
 {name: 'action'}
 ],
 data:[
[0,"rectangle"],
[1,"rectangle1"],
[2,"rectangle2"],
[3,"rectangle3"],
[4,"rectangle4"],
[5,"rectangle5"],
[6,"rectangle6"]
 ]
 }),
 columns:[
  {id:'id',header: "#",  width: 20, sortable: true, dataIndex: 'id'},
 {header: "Action", sortable: true, dataIndex: 'action'}
 ],

 viewConfig:{forceFit:true,autoFill:true},
 border: false
 }); // eo apply
  
 // call parent
 Ax.History.superclass.initComponent.apply(this, arguments);
 } // eo function initComponent
  
 });
 
 Ext.reg('history', Ax.History);

 //JS File: ../js/ui/clipboard.js 
 /*
Grid for Clipboard panel
*/

 Ax.Clipboard = Ext.extend(Ext.grid.GridPanel, {
 initComponent:function() {
 Ext.apply(this, {
 store: new Ext.data.SimpleStore({
 id:0,
 fields:[
 {name: 'id', type: 'float'},
 {name: 'type'}
 ],
 data:[
[0,"poop"],
[1,"poop1"],
[2,"poop2"],
[3,"poop3"],
[4,"poop4"],
[5,"poop5"],
[6,"poop6"]
 ]
 }),
 columns:[
 {id:'id',header: "#", width: 20, sortable: true, dataIndex: 'id'},
 {header: "Type", sortable: true, dataIndex: 'type'}
 ],
 viewConfig:{forceFit:true,autoFill: true},
  border: false
 }); // eo apply
  
 // call parent
 Ax.Clipboard.superclass.initComponent.apply(this, arguments);
 } // eo function initComponent
  
 });
 
 Ext.reg('clipboard', Ax.Clipboard);

 //JS File: ../js/ui/library.js 
 /*
Tree View for Library
*/

Ax.Library = Ext.extend(Ext.tree.TreePanel,{
  initComponent: function(){
  Ext.apply(this,{
    xtype:"treepanel",
    animate:true,
    autoScroll:true,
    containerScroll:true,
    root:new Ext.tree.TreeNode({text:'Tree Root',draggable : false}),
    dropConfig:{
      appendOnly:true
    },
    border:false

  });
    Ax.Library.superclass.initComponent.apply(this, arguments);
  }

});

Ext.reg("library",Ax.Library);



 //JS File: ../js/ui/login.js 
 Ax.LoginForm = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,{
layout:"accordion",
layoutConfig:{
  activeOnTop:false,
  animate:true,
  autoWidth:true,
  collapseFirst:false,
  fill:true,
  hideCollapseTool:false,
  titleCollapse:true
},
border: false,
items:[{
    title:"Login",
    layout: "fit",
    iconCls: "tb_login",
    //autoHeight:true,
    border: false,
    items:[{
        xtype:"form",
        labelWidth:30,
        border:false,
        items:[{
            xtype:"textfield",
            fieldLabel:"User",
            name:"textvalue",
            width:90
          },{
            xtype:"textfield",
            fieldLabel:"Pass",
            name:"textvalue",
            width:90
          },{
            xtype:"button",
            text:"Login"
          }]
      }]
  },{
    title:"Register",
    //autoHeight:true,
    layout: "fit",
    iconCls: "tb_register",
    border: false,
    items:[{
        xtype:"form",
        labelWidth:30,
        border:false,
        items:[{
            xtype:"textfield",
            fieldLabel:"User",
            name:"textvalue",
            width:90
          },{
            xtype:"textfield",
            fieldLabel:"Pass",
            name:"textvalue",
            width:90
          },{
            xtype:"textfield",
            fieldLabel:"Pass",
            name:"textvalue",
            width:90
          },{
            xtype:"button",
            text:"Create Account"
          }]
      }]
  }]
})

Ax.LoginForm.superclass.initComponent.apply(this, arguments);
}
})
Ext.reg("loginform",Ax.LoginForm)
 //JS File: ../js/ui/toolbar.js 
 Ax.MainToolbar = [
  {text:"File", menu: [
  {text: "New", iconCls: "tb_new"},
  {text: "Open", iconCls: "tb_open", menu: [
    {text: "From Computer", iconCls: "tb_comp"},
    {text: "From Webserver", iconCls: "tb_server"},
    {text: "From URL", iconCls: "tb_url"},
    {text: "From Text", iconCls: "tb_text"}
  ]},
  {text: "Save", iconCls: "tb_save",menu: [
    {text: "To Computer", iconCls: "tb_comp"},
    {text: "To Webserver", iconCls: "tb_server"},
    {text: "To Text", iconCls: "tb_text"}
  ]},
  "-",
  {text: "Publish", iconCls: "tb_publish"}
]},
{text:"Edit", menu: [
  {text: "Undo", iconCls: "tb_undo"},
  {text: "Redo", iconCls: "tb_redo"},
  "-", //seperator, i hope when i run this through a formatter the comments arent stripped.
  {text: "Cut", iconCls: "tb_cut"},
  {text: "Copy", iconCls: "tb_copy"},
  {text: "Paste", iconCls: "tb_paste"},
  {text: "Delete", iconCls: "tb_delete"}
]},
{text:"View", menu: [
  //Add some check item stuff for visible panels
  {text: "Animation", iconCls: "tb_animation"},
  {text: "Theme", iconCls: "tb_theme", menu: new Ext.ux.ThemeMenu},
  "-",
  {text: "Timeline", xtype: "checkitem", checked: true},
  {text: "Tools", xtype: "checkitem", checked: true},
  {text: "Misc", xtype: "checkitem", checked: true},
  {text: "Properties", xtype: "checkitem", checked: true},
  {text: "Actionscript", xtype: "checkitem", checked: true}
]},
{text:"Tools", menu: [
  {text: "Color Picker", iconCls: "tb_color"},
  {text: "Drawing", iconCls: "tb_tools", menu: [{text: "Select"}]},
  {text: "Debug Console", iconCls: "tb_debug", handler: function(){Ext.log("Opening Console")}},
  {text: "Macro Executor", iconCls: "tb_script"},
  {text: "Plugin Settings", iconCls: "tb_plugin_conf"},
  {text: "Reload Application", iconCls: "tb_reload"},
  {text: "Preload Icons", iconCls: "tb_preload", handler: function(){Ax.preload()}},
  {text: "Benchmark", iconCls: "tb_benchmark"}
]},
{text:"Timeline", menu: [
  {text: "New Layer",iconCls: "tb_newlayer", handler: function(){Ax.addLayer()}},
  {text: "To Keyframe",iconCls: "tb_addkeyframe"},
  {text: "Clear Frame",iconCls: "tb_clearframe"},
  "-", //organized from stuff you might actually use, compared to stuff you have a slight change if any of using
  {text: "Reload Data", iconCls: "tb_reload"},
  {text: "Set Last Frame", iconCls: "tb_setlast"},
  {text: "Purge Empty", iconCls: "tb_purge_empty"}
]},
{text:"Animation", menu: [
  {text: "Play", iconCls: "tb_play"},
  {text: "Pause", iconCls: "tb_pause"},
  {text: "Next Frame", iconCls: "tb_nf"},
  {text: "Previous Frame", iconCls: "tb_pf"},
  {text: "Last Frame", iconCls: "tb_last"},
  {text: "First Frame", iconCls: "tb_first"},
  "-", //not really related...
  {text: "Recalculate Tweens", iconCls: "tb_recalculate"}
]},
{text:"Plugins", menu: [
  {text: "Add Plugins", iconCls: "tb_plugin_add"},
  "-", //split
  {text: "Explode",iconCls: "tb_plugin"},
  {text: "Random Shape",iconCls: "tb_plugin"}
]},
{text:"User", menu: [
  {text: "Login", iconCls: "tb_login"},
  {text: "Logout", iconCls: "tb_logout"},
  {text: "Browse Animations", iconCls: "tb_browse"},
  {text: "Profile", iconCls: "tb_profile"}
]},
{text:"Help", menu: [
  {text: "About", iconCls: "tb_about", handler: function(){Ax.About()}},
  {text: "Key Shortcuts", iconCls: "tb_keyboard", handler: function(){Ax.keyGuide()}},
  {text: "Manual", iconCls: "tb_docs", handler: function(){Ax.loadManual()}},
  {text: "FAQ", iconCls: "tb_docs", handler: function(){Ax.loadFAQ()}},
  {text: "Bug Reports", iconCls: "tb_bug", handler: function(){throaw("Bug Report")}},
  {text: "Comments", iconCls: "tb_comment"},
  {text: "Donate", iconCls: "tb_donate"},
  {text: "Interactive Tutorials", iconCls: "tb_tutorial", menu: [
    {text: "Beginner's Tutorial", iconCls: "tb_info"}
  ]}
  ]}
]
 //JS File: ../js/ui/panels/center.js 
 Ax.LayoutCenterPanel = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,{

    region:"center",
    //title:"Canvas",
	
    layout:"fit",
	//tbar: Ax.MainToolbar,
    border:true,
    items:[{
        xtype:"tabpanel",
		id: "maintabpanel",
        tabPosition:"bottom",
        border:false,
        activeTab:0,
        items:[{
            xtype:"panel",
            title:"Canvas",
			iconCls: "canvas_icon",
            layout:"fit",
			tabTip: "Draw and create your animations",
             border:false,
			listeners: {
				'activate' : function(){
					Ax.gs(9)
				}
			},
			items: [{
			//region: "center",
			id: "canvas",
            xtype:"panel",
            title:"Canvas",
			bbar: new Ext.StatusBar(Ax.CanvasStatusbar),
			tools: [{id: "gear"},{id: "help", 
			qtip: "Select tools from the west panel and draw on the canvas with them."}],
			iconCls: "canvas_icon",			
            layout:"fit",
            
			tbar: [
      {cls: "x-btn-text-icon",icon: Ax.files.silk+"film_eject.png", iconCls: "hide_timeline", text: "Hide Timeline"}
      ,{xtype: "tbfill"},{text:"Zoom"},
      {xtype: "slider", width: 120, maxValue: 300, value: 100, increment: 5,plugins: new Ext.ux.SliderTip({
      getText: function(slider){return String.format('Canvas Zoom: {0}%', slider.getValue())}
        })}],

			 html:"<div class=\"x-border-layout-ct canvas_container\">"+
       "<div id=\"drawcanvas\" class=\"canvas\"><a href='#' onclick='Ax.preinit();Ax.drawinit();return false'>Click Here to turn on OnlyPaths!</a></div>"+
       "</div>",
			 border: false
			}]
          },{
            xtype:"panel",
            title:"Preview",
			iconCls: "preview_icon",
			tabTip: "Preview and Export your animations",
			items: [{
			id: "preview",
            xtype:"panel",
            title:"Preview",
			tbar: [{text: "stuff"},{xtype: "tbfill"},{text:"Zoom"},
      {xtype: "slider", width: 120, maxValue: 300, value: 100, increment: 5,plugins: new Ext.ux.SliderTip({
      getText: function(slider){return String.format('Canvas Zoom: {0}%', slider.getValue())}
        })}],
			bbar: new Ext.StatusBar(Ax.PreviewStatusbar),
			border: false,
			tools: [{id: "gear"},{id: "help",
			qtip: "Preview and Export your animations to Flash&reg; ... Hopefully"}],
			iconCls: "preview_icon",			
            layout:"fit",
						 html:"<div class=\"x-border-layout-ct canvas_container\">"+
       "<div class=\"canvas\">Um... an animations should be playing here...</div>"+
       "</div>",
			
			}],
			listeners: {
				'activate' : function(){
					Ax.gs(7)
				}
			},
            layout:"fit",
			border: false
          },{
		  iconCls: "animations_icon",
		  xtype: "animationbrowser", 
		  tabTip: "Share and View other user's animations",
		  listeners: {
				'activate' : function(){
					Ax.gs(8)
				}
			}
		  }]
      }]
  })
   Ax.LayoutCenterPanel.superclass.initComponent.apply(this, arguments);
  }
  })
  
  Ext.reg("layoutcenter",Ax.LayoutCenterPanel)
 //JS File: ../js/ui/panels/east.js 
 Ax.LayoutEastPanel = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,{
    region:"east",
    title:"Misc",
	iconCls: "misc_panel_icon",
    split:true,
    collapsible:true,
    titleCollapse:true,
    width:130,
    layout:"fit",
    border:true,
    items:[{
        xtype:"tabpanel",
        activeTab:0,
        border:false,
        items:[{
            xtype:"panel",
            title:"Misc",
			iconCls: "misc_icon",
            layout:"fit",
            items:[{
                layout:"accordion",
                layoutConfig:{
                  activeOnTop:false,
                  animate:true,
                  autoWidth:true,
                  collapseFirst:false,
                  fill:true,
                  hideCollapseTool:false,
                  titleCollapse:true
                },
                border:false,
                items:[{
                    title:"History",
                    autoHeight:true,
					iconCls: "history_icon",
                    border:false,
					tools: [{id: "close", qtip: "Clear History"}],
                    items:[{xtype: "history"}]
                  },{
                    title:"Clipboard",
                    autoHeight:true,
					iconCls: "clipboard_icon",
					tools: [{id: "close", qtip: "Clear Clipboard"}],
                    border:false,
                    items:[{xtype:"clipboard"}]
                  },{
                    title:"Library",
                    autoHeight:true,
					iconCls: "library_icon",
                    border:false,
                    items:[{xtype:"library"}]
                  },{
                    title:"Misc",
                    autoHeight:true,
					iconCls: "misc_icon",
                    html:"None Yet :P",
                    border:false
                  }]
              }]
          },{
            xtype:"panel",
            title:"User",
			iconCls: "user_icon",
      layout: "fit",
            border:false,
            //html: "hi",
			items:[{xtype: "loginform"}]
			//items: {html:"Yo wazzup dawg"}
          
		  }]
      }]
  })
   this.initialConfig.collapsible = true; //bugfix from http://outroot.com/extjs/bug1/ 
   Ax.LayoutEastPanel.superclass.initComponent.apply(this, arguments);
  }
  })
  
  Ext.reg("layouteast",Ax.LayoutEastPanel)
 //JS File: ../js/ui/panels/west.js 
 Ax.LayoutWestPanel = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,{
    region:"west",
    title:"Tools",
    split:true,
    collapsible:true,
    titleCollapse:true,
    hideCollapseTool: true,
    //html: "<img src='../img/mockup/tools.png'>",
    width:50,
    border:true,
    items: [{xtype:"toolbox"},{xtype: "drawpanel"}]
  })
   this.initialConfig.collapsible = true; //bugfix from http://outroot.com/extjs/bug1/ 
   Ax.LayoutWestPanel.superclass.initComponent.apply(this, arguments);
  }
  })
  
  Ext.reg("layoutwest",Ax.LayoutWestPanel)

  
  
 //JS File: ../js/ui/panels/north.js 
 Ax.LayoutNorthPanel = Ext.extend(Ext.Panel,{
initComponent: function(){

Ext.apply(this,{
    region:"north",
	layout: "fit",
    collapsible:true,
    collapseMode: "mini",
    split:true,
	border: false,
    height:70,
//    border:true,
	items: {xtype: "timeline", border: false}
  })
  this.initialConfig.collapsible = true; //bugfix from http://outroot.com/extjs/bug1/ 

   Ax.LayoutNorthPanel.superclass.initComponent.apply(this, arguments);
  }
  })
  
  Ext.reg("layoutnorth",Ax.LayoutNorthPanel)
 //JS File: ../js/ui/panels/south.js 
 Ax.LayoutSouthPanel = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,{
	collapsedTitle: "Properties",
    region:"south",
	iconCls: "app_settings",
    title:"Properties",
    split:true,
    collapsible:true,
    titleCollapse:true,
    height:50,
	items: [{
	xtype: "form",
	labelWidth: 50,
	border: false,
	items: [{
	layout: "column",
	defaults: {
	 width: 120
	 },
	border: false,
	items: [{
	layout: "form",
	border: false,
	items: [{
		xtype: "numberfield",
		fieldLabel: "Width",
		name: "Width",
		width: 60
	}]
	},{
	layout: "form",
	border: false,
	items: [{
		xtype: "numberfield",
		fieldLabel: "Height",
		name: "Width",
		width: 60
	}]
	}]
	}]
	}]
  })
   this.initialConfig.collapsible = true; //bugfix from http://outroot.com/extjs/bug1/ 
   Ax.LayoutSouthPanel.superclass.initComponent.apply(this, arguments);
  }
  })
  
  Ext.reg("layoutsouth",Ax.LayoutSouthPanel)
 //JS File: ../js/ui/register.js 
 Ax.RegistrationForm = Ext.extend(Ext.form.FormPanel,{
initComponent: function(){
Ext.apply(this,{
  xtype:"form",
  title:"Registration Form",
  border:false,
  items:[{
      xtype:"textfield",
      fieldLabel:"Username",
      name:"textvalue"
    },{
      xtype:"textfield",
      fieldLabel:"Password",
      name:"textvalue",
      inputType:"password"
    },{
      xtype:"textfield",
      fieldLabel:"Password",
      name:"textvalue",
      inputType:"password"
    },{
      xtype:"button",
      text:"Register Account"
    }]
})

Ax.RegistrationForm.superclass.initComponent.apply(this, arguments);
}
})
Ext.reg("registrationform",Ax.RegistrationForm)
 //JS File: ../js/ui/main.js 
 /*
Main User Interface

'Glues' all components together
*/



Ext.onReady(function(){

Ax.viewport = new Ext.Viewport(
{
layout:"border",
border:false,
window:{
  layout:"fit"//,
  //tbar: {xtype: "maintoolbar"}
},


items: [
{
region: "north",
id: "north",
border: false,
tbar: Ax.MainToolbar,
height: 27
},
{
region: "center",
layout: "border",
border: false,
items: [
{xtype: "layoutcenter"},
{xtype: "layoutnorth"},
{xtype: "layoutsouth"},
{xtype: "layoutwest"},
{xtype: "layouteast"}
]  //end main app border layout items
}
]

  //}]  //end main toolbar border layout items
} //end border layout

); //End Viewport


setTimeout(function(){
    Ext.get('loading').remove();
    Ext.get('loading-mask').fadeOut({remove:true});
}, 250);


}); //End Ext.onReady

 //JS File: ../js/animation/animations.js 
 Ax.AnimationBrowser = Ext.extend(Ext.Panel,{
initComponent: function(){
Ext.apply(this,

{
id: "Animations",
xtype:"panel",
title:"Animations",
layout:"fit",
//html:"<img src='../img/mockup/animationbrowser.png' style='width: 500px; height: 400px'>"
items: {
layout:"border",

items:[{
border: false,
region:"center",
html: "oaki",
title:"Player",
id: "Player",
autoScroll: true,
tools: [{id: "gear"},{id: "help",
qtip: "View and share animations with other users. Use the left panel to browse for animations,"+
" and click them to view them. Feel free to press the \"import\" button and make improvements."}],
iconCls: "player_icon",
tbar: [{text: "By:&nbsp;Hardcoded&nbsp;Name"},{xtype: "tbfill"},
"Rating&nbsp;System"],
bbar: [{text: "Play",handler: function(){
this.setText((this.getText()=="Play")?"Pause":"Play")} //just a really really condensed script :P
},
{text: "Forward"},
{text: "Rewind"},
{xtype: "tbfill"},
"0/1337 0FPS"
]
},{
border: false,
region:"west",
id: "treebrowse",
title:"Browse",
collapseFirst: false,
tools: [
{id: "plus",qtip: "Expand All", handler: function(){
Ax.viewport.findById("treebrowse").expandAll()}}, //crap! i'm sure this is crappy coding style
{id: "minus", qtip: "Collapse All", handler: function(){
Ax.viewport.findById("treebrowse").collapseAll()}}], //crap! i'm sure this is crappy coding style.
iconCls: "browse_icon",
width:200,
split:true,
collapsible:true,
layout: "fit",
titleCollapse:true,

//items: [{
		border: false,
        xtype:"treepanel",
        useArrows:true,
        autoScroll:true,
        animate:true,
        enableDD:false,
        containerScroll: true, 
		bbar: [{text: "Reload", qtip: "Reload Thingy"},
{text: "Expand", qtip: "Expand All Nodes", handler: function(){
Ax.viewport.findById("treebrowse").expandAll()}},
{text: "Collapse",qtip: "Collapse All Nodes", handler: function(){
Ax.viewport.findById("treebrowse").collapseAll()
}}],
		root: new Ext.tree.AsyncTreeNode({
        text: 'Users',
		expanded: true,
        draggable:false,
        id:'.'
		}),
        loader: new Ext.tree.TreeLoader({
            dataUrl:Ax.files.userlist
        }),
		listeners: {
		"click":function(node){
		if(node.childrenRendered==false){
		Ext.Ajax.request({
		url: "../"+node.id,
		success: function(e){
		Ax.viewport.findById("Player").body.dom.innerHTML = Ax.util.htmlentities(e.responseText); //bad code!!!!!

		}
		})
		}
		}
		}


          
//}]

}
],


border: false
}
}

)//end ext.apply




 Ax.AnimationBrowser.superclass.initComponent.apply(this, arguments);
}

})

Ext.reg("animationbrowser",Ax.AnimationBrowser)


 //JS File: ../js/animation/timeline.js 
 Ax.Timeline = Ext.extend(Ext.Panel,{
  initComponent: function(){
    this.cellActions = new Ext.ux.grid.CellActions({
      callbacks: {
        "tb_delete":function(grid,record,action,value){
          Ext.MessageBox.confirm("Delete "+value+" OMG!!!!",
          "Are you positively super duper sure you want to do this action that your life depends on?!?!?!")
          Ax.msg('Callback: delete layer', 'You have clicked: <b>{0}</b>, action: <b>{1}</b>', value, action);
        }
      }
    });
    Ext.apply(this,{
      layout:"border",
      items:[{
        region:"center",
        autoScroll: true,
        border: false,
        html: "<div id='timeline_core' style='overflow: auto; height: 100%; width: 100%'>Loading Frames...</div>"
      },{
        region:"west",
        width: 100,
        border: false,
        split:true,
        collapsible:true,
        collapseMode:"mini",
        autoScroll: true,
        layout: "fit",
        //html: "Layers"
        items: {
          id: "layers",
          xtype:"editorgrid",
          border:false,
          hideHeaders: true,
          plugins: [this.cellActions],
          viewConfig:{
            autoFill: true,
            forceFit:true
          },
          listeners: {
            "afteredit":function(object){
              //console.log(object.originalValue,object.value)
              Ax.renameLayer(object.originalValue,object.value)
            }
          },
          //clicksToEdit:1,
          ds:/*BEGIN*/new Ext.data.Store()/*END*/,
          columns: [
          {header: "Comment",dataIndex: "comment", editor:new Ext.form.TextField(), cellActions: [
            {
              iconCls: "tb_delete",
              qtip: "Delete this frame"
            }
          ]}
          ]
        }
      }]
    })
    Ax.Timeline.superclass.initComponent.apply(this, arguments);
  }
})

Ext.reg("timeline",Ax.Timeline)
 //JS File: ../js/animation/timeline_core.js 
 Ax.timeline = null;
Ax.layers = {};

Ax.tstat = {
  layers: 0,
  frames: 0
}

Ax.tcurrent = {
  layer: null,
  frame: null
}

Ax.renameLayer = function(oldname,newname){
  Ax.layers[newname]=Ax.layers[oldname];
  delete Ax.layers[oldname]
  return Ax.layers
}

Ax.deleteLayer = function(name){
  delete Ax.layers[name]
  
}

Ax.addLayer = function(layername){
  (layername)?layername:layername = "Layer "+(Ax.tstat.layers+1).toString();
  Ax.viewport.findById("layers").getStore().add(new Ext.data.Record({comment:layername}))
  var layer = document.createElement("tr"); 
  Ax.layers[layername]=layer
  //Ax.current.layer = layer
  Ax.tstat.layers++
  Ax.timeline.appendChild(layer)
  
  for(var frame = 0; frame < Ax.tstat.frames; frame++){
    Ax.addFrame_core(frame+1,layername)
  }
  
  return layer;
}
Ax.addFrame = function(){
  Ax.tstat.frames++
  for(var layer in Ax.layers){
    Ax.addFrame_core(Ax.tstat.frames,layer)
  }
}

Ax.addFrames = function(frames){ //mind the s, this just loops through whatever number and makes so many frames
  for(var i = 0; i < frames; i++){
    Ax.addFrame()
  }
}

Ax.addFrame_core = function(frame,layer){
  //console.log(layer)
  var frame_cell = document.createElement("td")
  //frame.style.bgColor = "#99BBE8";
  frame_cell.className = "frame"

  var frame_content = document.createElement("div")
  frame_content.className = "frame"

  frame_content.innerHTML =  frame//[1,2,5,10,42,420,316,4242,1337][Math.floor(Math.random()*9)];

  switch(frame_content.innerHTML.length){
    case 1:
      frame_content.style.marginTop = "1px";    
      frame_content.style.fontSize = "110%";
      //frame_content.style.marginTop = "-6px";
      //frame_content.style.fontSize = "140%";
    break;
    case 2:
      frame_content.style.marginTop = "2px";    
      frame_content.style.fontSize = "100%";
      break;
    case 3:
      frame_content.style.marginBottom = "-7px"
      frame_content.style.fontSize = "65%";
    break;
    case 4:
      frame_content.style.marginBottom = "-11px"
      frame_content.style.fontSize = "40%";
    break;
  }

  frame_cell.appendChild(frame_content)

  Ax.layers[layer].appendChild(frame_cell)
}
//#99BBE8

Ax.initTimeline = function(){
  Ext.get("timeline_core").dom.innerHTML = ""
  frameTable = document.createElement("table");
  frameTable.setAttribute("cellspacing","0")
  frameTable.setAttribute("cellpadding","0")
  frameTable.setAttribute("border","0")
  //frameTable.style.border = "1px solid gray"
  frameTable.appendChild(document.createElement("tbody"))
  Ext.get("timeline_core").dom.appendChild(frameTable)
  Ax.timeline = frameTable
}


Ext.onReady(function(){
  Ax.initTimeline()
  Ax.addLayer()
  Ax.addFrames(150)
})
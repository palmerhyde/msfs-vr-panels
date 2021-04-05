class IngamePanelCustomPanel extends NavSystemTouch {
    constructor() {
        super(...arguments);
        try {
            if (this.debugEnabled) {
                var self = this;
                self.isDebugEnabled()
                setTimeout(() => {
                    self.isDebugEnabled();
                }, 1000);
            } else {
                this.initialize();
            }
            
            this.ingameUi = null;
            this.debugEnabled = true;
            this.comActiveFreq = null;
            this.comStandByFreq = null;
            this.navActiveFreq = null;
            this.navStandByFreq = null;
            this.transponderValue = null;
            this.transponderMode = null;
            this.startTime = Date.now();
        }
        catch (e) {
            console.log(e)
        }
    }
    isDebugEnabled() {
        var self = this;
        if (typeof g_modDebugMgr != "undefined") {
            g_modDebugMgr.AddConsole(null);
            g_modDebugMgr.AddDebugButton("Identifier", function() {
                console.log('Identifier');
                console.log(self.instrumentIdentifier);
            });
            g_modDebugMgr.AddDebugButton("TemplateID", function() {
                console.log('TemplateID');
                console.log(self.templateID);
            });
            g_modDebugMgr.AddDebugButton("Source", function() {
                console.log('Source');
                console.log(window.document.documentElement.outerHTML);
            });
			g_modDebugMgr.AddDebugButton("close", function() {
				console.log('close');
				if (self.ingameUi) {
					console.log('ingameUi');
					self.ingameUi.closePanel();
				}
			});
            this.initialize();
        } else {
            Include.addScript("/JS/debug.js", function () {
                if (typeof g_modDebugMgr != "undefined") {
                    g_modDebugMgr.AddConsole(null);
                    g_modDebugMgr.AddDebugButton("Identifier", function() {
                        console.log('Identifier');
                        console.log(self.instrumentIdentifier);
                    });
                    g_modDebugMgr.AddDebugButton("TemplateID", function() {
                        console.log('TemplateID');
                        console.log(self.templateID);
                    });
                    g_modDebugMgr.AddDebugButton("Source", function() {
                        console.log('Source');
                        console.log(window.document.documentElement.outerHTML);
                    });
                    g_modDebugMgr.AddDebugButton("close", function() {
                        console.log('close');
                        if (self.ingameUi) {
                            console.log('ingameUi');
                            self.ingameUi.closePanel();
                        }
                    });
                    self.initialize();
                } else {
                    setTimeout(() => {
                        self.isDebugEnabled();
                    }, 2000);
                }
            });
        }
    }
    connectedCallback() {
        super.connectedCallback();
        var self = this;
        this.ingameUi = this.querySelector('ingame-ui');
        this.comActiveFreq = document.getElementById("ComActiveFreq");
        this.comStandByFreq = document.getElementById("ComStandbyFreq");
        this.navActiveFreq = document.getElementById("NavActiveFreq");
        this.navStandByFreq = document.getElementById("NavStandbyFreq");
        this.transponderValue = document.getElementById("XPDRValue");
        this.transponderMode = document.getElementById("XPDRMode");
        
        document.getElementById("ComActiveButton").addEventListener('mousedown', () => {
            console.log('COM Swap');
            this.toggleComFreq()
            let seen = [];
            const foo = JSON.stringify(this.currFlightPlan, function(key, val) {
                if (val != null && typeof val == "object") {
                     if (seen.indexOf(val) >= 0) {
                         return;
                     }
                     seen.push(val);
                 }
                 return val;
             });
            console.log('Flight Plan:', foo)
            //this.playInstrumentSound("tone_NavSystemTouch_touch");
        });

        document.getElementById("NavActiveButton").addEventListener('mousedown', () => {
            console.log('Nav Swap');
            this.toggleNavFreq()
            //this.playInstrumentSound("tone_NavSystemTouch_touch");
        })  
    }
    Update() {
        super.Update()
        // These properties are inherited from NavSystem
        this.comActiveFreq.innerHTML = this.GetComActiveFreq();
        this.comStandByFreq.innerHTML = this.GetComStandbyFreq();
        this.navActiveFreq.innerHTML = this.GetNavActiveFreq();
        this.navStandByFreq.innerHTML = this.GetNavStandbyFreq();
        
        // TODO: investigate where transponder values are inherited from
        this.transponderValue.textContent = this.getTransponderCode();
        this.transponderMode.textContent = this.getTransponderMode();
    }
    initialize() {
        console.log('initalize()')
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    //getActiveComFreq() {
    //    return this.frequency3DigitsFormat(SimVar.GetSimVarValue("COM ACTIVE FREQUENCY:1", "MHz"));
    //}
    //getStandbyComFreq() {
    //    return this.frequency3DigitsFormat(SimVar.GetSimVarValue("COM STANDBY FREQUENCY:1", "MHz"));
    //}
    getTransponderCode() {
        return ("0000" + SimVar.GetSimVarValue("TRANSPONDER CODE:1", "number")).slice(-4);
    }
    getTransponderMode() {
        switch (SimVar.GetSimVarValue("TRANSPONDER STATE:1", "number")) {
            case 1:
                return ('STBY');
            case 3:
                return ('ON');
            case 4: 
                return ('ALT');
            default:
                return ('?');
        }
    }
    toggleComFreq() {
        SimVar.SetSimVarValue("K:COM_STBY_RADIO_SWAP", "number", 0);
    }
    toggleNavFreq() {
        SimVar.SetSimVarValue("K:NAV1_RADIO_SWAP", "number", 0);
    }
    //frequency3DigitsFormat(_num) {
    //    var freq = Math.round(_num * 1000 - 0.1) / 1000;
    //    return freq.toFixed(3);
    //}
}

// Monkey Patch to bypass loading instruments
BaseInstrument.allInstrumentsLoaded = true;
window.customElements.define("ingamepanel-custom", IngamePanelCustomPanel);
checkAutoload();
class PanelListener extends ViewListener.ViewListener {
}

function RegisterPanelListener(callback) {
    // TODO: Why does this need to be called "JS_LISTENER_ATC"?
    return RegisterViewListenerT("JS_LISTENER_ATC", callback, PanelListener);
}

class IngamePanelCustomPanel extends BaseInstrument {
    constructor() {
        console.log('constructor()');
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
        this.comStandByFreq = document.getElementById("ComStandByFreq");
        
        this.PanelListener = RegisterPanelListener(() => {
            document.getElementById("RadioSwap").addEventListener('mousedown', () => {
                console.log('RadioSwap');
                console.log(this.getActiveComFreq());
                console.log(this.getStandbyComFreq());
                this.comActiveFreq.textContent = this.getActiveComFreq();
                this.comStandByFreq.textContent = this.getStandbyComFreq();
            });
        });
    }
    Update() {
        this.comActiveFreq.textContent = this.getActiveComFreq();
        this.comStandByFreq.textContent = this.getStandbyComFreq();
    }
    initialize() {
        console.log('initalize()')
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    // Copy of KX155A.js The plan is to inherit from here instead.
    getActiveComFreq() {
        return this.frequency3DigitsFormat(SimVar.GetSimVarValue("COM ACTIVE FREQUENCY:1", "MHz"));
    }
    getStandbyComFreq() {
        return this.frequency3DigitsFormat(SimVar.GetSimVarValue("COM STANDBY FREQUENCY:1", "MHz"));
    }
    frequency3DigitsFormat(_num) {
        var freq = Math.round(_num * 1000 - 0.1) / 1000;
        return freq.toFixed(3);
    }
}

// Monkey Patch to bypass loading instruments
BaseInstrument.allInstrumentsLoaded = true;
window.customElements.define("ingamepanel-custom", IngamePanelCustomPanel);
checkAutoload();
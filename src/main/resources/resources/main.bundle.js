webpackJsonp([1],{

/***/ "./src async recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src async recursive";

/***/ }),

/***/ "./src/app/anonymization-handler.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__http_service__ = __webpack_require__("./src/app/http.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnonymizationHandlerService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AnonymizationHandlerService = (function () {
    function AnonymizationHandlerService(httpService, sanitizer) {
        var _this = this;
        this.httpService = httpService;
        this.sanitizer = sanitizer;
        this.temporaryAnonymization = [];
        this.httpService.getLabels().then(function (labels) { return _this.allLabels = labels; });
    }
    /**
     * Resets the loaded document after it is saved and exported to start over with another one.
     */
    AnonymizationHandlerService.prototype.resetDisplayableText = function () {
        this.anonymizations.length = 0;
        this.displayableText = '';
    };
    AnonymizationHandlerService.prototype.getText = function () {
        return this.displayableText;
    };
    AnonymizationHandlerService.prototype.getAnonymizations = function () {
        return this.anonymizations.concat(this.temporaryAnonymization);
    };
    /**
     * Finds all of the processed anonymizations which are labeled with the given status.
     * @param status labeled status to search for
     * @return list with id's which have the given status
     */
    AnonymizationHandlerService.prototype.findAnonymizationsByStatus = function (status) {
        var foundAnonymizations = [];
        var allAnonymizations = this.getAnonymizations();
        for (var i = 0; i < allAnonymizations.length; ++i) {
            if (allAnonymizations[i].status === status) {
                foundAnonymizations.push(allAnonymizations[i].id);
            }
        }
        return foundAnonymizations;
    };
    /**
     * Sets a given anonymization as actually reworking to be able to rework an newly added one.
     * @param actual given anonymization to set as actuallyReworking
     */
    AnonymizationHandlerService.prototype.setActualleReworking = function (actual) {
        this.actuallyReworking = actual;
    };
    AnonymizationHandlerService.prototype.getActuallyReworking = function () {
        return this.actuallyReworking;
    };
    AnonymizationHandlerService.prototype.getLabels = function () {
        return this.allLabels;
    };
    /**
     * Generates a <span> element with different background colors based on the index of the given label
     * @param label one of the loaded labels (e.g. Person, Organization) which the color bases on
     * @param original the word(-sequence) which is placed in the <span>
     * @param asHTML directly sanitize as HTML or not
     * @return a string or a HTML based on the asHTML parameter
     */
    AnonymizationHandlerService.prototype.generateColorForLabel = function (label, original, asHTML) {
        var replacement = '';
        var indexOfLabel = this.allLabels.indexOf(label);
        if (indexOfLabel === -1) {
            replacement += '<span style="background-color:rgb( 255 , 255, 255)">' + original + '</span>';
        }
        else {
            replacement += '<span style="background-color:';
            switch (indexOfLabel) {
                case 0:
                    replacement += 'rgb(60, 180, 75)';
                    break;
                case 1:
                    replacement += 'rgb(255, 225, 25)';
                    break;
                case 2:
                    replacement += 'rgb(0, 130, 200)';
                    break;
                case 3:
                    replacement += 'rgb(245, 130, 48)';
                    break;
                case 4:
                    replacement += 'rgb(250, 190, 190)';
                    break;
                case 5:
                    replacement += 'rgb(230, 190, 255)';
                    break;
                case 6:
                    replacement += 'rgb(255, 250, 200)';
                    break;
                case 7:
                    replacement += 'rgb(170, 255, 195)';
                    break;
                case 8:
                    replacement += 'rgb(128, 128, 0) ';
                    break;
                case 9:
                    replacement += 'rgb(210, 245, 60)';
                    break;
                case 10:
                    replacement += 'rgb(0, 128, 128)';
                    break;
                case 11:
                    replacement += 'rgb(240, 50, 230)';
                    break;
                default:
                    replacement += 'rgb(255, 215, 180)';
                    break;
            }
            replacement += '">' + original + '</span>';
        }
        if (asHTML) {
            return this.sanitizer.bypassSecurityTrustHtml(replacement);
        }
        return replacement;
    };
    AnonymizationHandlerService.prototype.setTemporatyAnonymization = function () {
        this.temporaryAnonymization.length = 0;
        this.temporaryAnonymization.push(this.actuallyReworking);
    };
    AnonymizationHandlerService.prototype.setUpParams = function (displayableText, anonymizations) {
        this.displayableText = displayableText;
        this.anonymizations = anonymizations;
        this.findNextAnonymization();
    };
    /**
     * Finds the maximal id of the anonymizations in the anonymization list
     * @return the highest id of the anonymizations
     */
    AnonymizationHandlerService.prototype.getMaxId = function () {
        var highestIndex = 0;
        var id;
        for (var i = 0; i < this.anonymizations.length; ++i) {
            id = this.anonymizations[i].id;
            if (id > highestIndex) {
                highestIndex = id;
            }
        }
        return highestIndex;
    };
    /**
     * Finds the anonymization from the anonymizations list which comes next in the displayableText.
     * Basically looks after the lowest index of the originals with pattern search. This should
     * help to go from top to bottom through the text. When the lowest is found it is set as
     * actuallyReworking.
     */
    AnonymizationHandlerService.prototype.findNextAnonymization = function () {
        console.log('findNextAnonymization accessed.');
        var lowestIndex = Number.MAX_VALUE;
        var foundIndex;
        var nextAnonymization = -1;
        for (var i = 0; i < this.anonymizations.length; ++i) {
            if (this.findAnonymizationsByStatus('DECLINED').concat(this.findAnonymizationsByStatus('ACCEPTED'))
                .includes(this.anonymizations[i].id)) {
                continue;
            }
            var regex = this.formRegexFromOriginal(this.anonymizations[i].data.original);
            foundIndex = this.displayableText.search(new RegExp(regex));
            if (foundIndex === -1) {
                console.log(this.anonymizations[i].data.original + ' not found!');
                continue;
            }
            else if (foundIndex < lowestIndex) {
                lowestIndex = foundIndex;
                nextAnonymization = i;
            }
        }
        if (nextAnonymization === -1) {
            this.actuallyReworking = null;
        }
        this.actuallyReworking = this.anonymizations[nextAnonymization];
    };
    /**
     * Escapes all special characters contained in the original, also replaces all "\n" with <br/>
     * to find it in the displayable text
     * @param original the original of an anonymization to generate the regex from
     * @return the formed regex
     */
    AnonymizationHandlerService.prototype.formRegexFromOriginal = function (original) {
        original = original.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        original = original.replace(/\n/g, '<br/>');
        return original;
    };
    /**
     * Pushes the accepted anonymization to the accepted list and
     * searches the next one in the text (called if 'a' is pressed)
     */
    AnonymizationHandlerService.prototype.acceptedActualAnonymization = function () {
        console.log('Accepted!');
        if (this.actuallyReworking == null) {
            console.log('Document finished!');
            return;
        }
        this.actuallyReworking.status = 'ACCEPTED';
        this.findNextAnonymization();
    };
    /**
     * Pushes the declined anonymization to the declined list, removes it from
     * the anonymization list and searches the next one in the text
     * (called if 'd' is pressed)
     */
    AnonymizationHandlerService.prototype.declineActualAnonymization = function () {
        if (this.actuallyReworking == null) {
            console.log('Document finished!');
            return;
        }
        var index = this.anonymizations.indexOf(this.actuallyReworking);
        this.actuallyReworking.status = 'DECLINED';
        this.findNextAnonymization();
    };
    /**
     * Pushes the actual anonymization to the reworked list and searches the next.
     * (called if 'enter' is pressed after going to the rework zone)
     */
    AnonymizationHandlerService.prototype.reworkedActualAnonymization = function () {
        if (this.actuallyReworking == null) {
            console.log('Document finished!');
            return;
        }
        this.actuallyReworking.status = 'ACCEPTED';
        this.findNextAnonymization();
    };
    /**
     * Adds the newly added anonymization to the anonymization list and searches the next.
     * (called if 'enter' is pressed after going to the rework zone and
     * the actually reworking has a id which is the highst + 1)
     */
    AnonymizationHandlerService.prototype.addedNewAnonymization = function () {
        this.actuallyReworking.status = 'ACCEPTED';
        this.anonymizations.push(this.actuallyReworking);
        this.findNextAnonymization();
        this.temporaryAnonymization.length = 0;
    };
    return AnonymizationHandlerService;
}());
AnonymizationHandlerService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__http_service__["a" /* HttpService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__http_service__["a" /* HttpService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]) === "function" && _b || Object])
], AnonymizationHandlerService);

var _a, _b;
//# sourceMappingURL=anonymization-handler.service.js.map

/***/ }),

/***/ "./src/app/anonymization.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__replacement__ = __webpack_require__("./src/app/replacement.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Anonymization; });

var Anonymization = (function () {
    function Anonymization() {
        this.data = new __WEBPACK_IMPORTED_MODULE_0__replacement__["a" /* Replacement */]();
    }
    return Anonymization;
}());

//# sourceMappingURL=anonymization.js.map

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'AnonML';
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("./src/app/app.component.html"),
        styles: [__webpack_require__("./src/app/app.component.css")]
    })
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__highlight_anonymization_pipe__ = __webpack_require__("./src/app/highlight-anonymization.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__focus_rework_directive__ = __webpack_require__("./src/app/focus-rework.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__focus_main_directive__ = __webpack_require__("./src/app/focus-main.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__control_component__ = __webpack_require__("./src/app/control.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var appRoutes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_9__control_component__["a" /* ControlComponent */] },
    { path: 'document/:id', component: __WEBPACK_IMPORTED_MODULE_9__control_component__["a" /* ControlComponent */] },
    { path: '**', redirectTo: '' }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__highlight_anonymization_pipe__["a" /* HighlightAnonymizationPipe */],
            __WEBPACK_IMPORTED_MODULE_6__focus_rework_directive__["a" /* FocusReworkDirective */],
            __WEBPACK_IMPORTED_MODULE_7__focus_main_directive__["a" /* FocusMainDirective */],
            __WEBPACK_IMPORTED_MODULE_9__control_component__["a" /* ControlComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_8__angular_router__["a" /* RouterModule */].forRoot(appRoutes),
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "./src/app/control.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/* Set height of the grid so .sidenav can be 100% (adjust if needed) */\r\n.row.content {\r\n\theight: 1500px;\r\n}\r\n\r\n/* Set gray background color and 100% height */\r\n.sidenav {\r\n\tbackground-color: #f1f1f1;\r\n\theight: 100%;\r\n\tpadding-left: 5%;\r\n\tpadding-top: 1%;\r\n}\r\n\r\n/* Set black background color, white text and some padding */\r\nfooter {\r\n\tbackground-color: #555;\r\n\tcolor: white;\r\n\tpadding: 15px;\r\n}\r\n\r\n/* On small screens, set height to 'auto' for sidenav and grid */\r\n@media screen and (max-width: 767px) {\r\n\t.sidenav {\r\n\t\theight: auto;\r\n\t\tpadding: 15px;\r\n\t}\r\n\t.row.content {\r\n\t\theight: auto;\r\n\t}\r\n}\r\n\r\n.btn-sq-lg {\r\n  width:65px !important;\r\n  height:65px !important;\r\n}\r\n\r\n.btn-sq-sm {\r\n  width:32px !important;\r\n  height:32px !important;\r\n}\r\n\r\n/* layout.css Style */\r\n.upload-drop-zone {\r\n  height: 30%;\r\n  width: 100%;\r\n  border-width: 2px;\r\n  margin-bottom: 20px;\r\n}\r\n\r\n/* skin.css Style*/\r\n.upload-drop-zone {\r\n  color: #ccc;\r\n  border-style: dashed;\r\n  border-color: #ccc;\r\n  line-height: 400px;\r\n  text-align: center\r\n}\r\n.upload-drop-zone.drop {\r\n  color: #222;\r\n  border-color: #222;\r\n}\r\n\r\n.white {\r\n\tbackground-color: white;\r\n\tpadding-left: 1%;\r\n\t\r\n}\r\n\r\n.fixed-panel {\r\n  min-height: 1000px;\r\n  max-height: 1000px;\r\n  overflow-y: scroll;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/control.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n\t<div class=\"row content\">\n\t\t<div *ngIf=\"!anonymizationHanlderService.displayableText\"\n\t\t\tclass=\"col-sm-10 sidenav\">\n\t\t\t<input id=\"input-1\" type=\"file\" class=\"upload-drop-zone file\"\n\t\t\t\t(change)=\"fileHandle($event)\">\n\t\t</div>\n\t\t<div id=\"controlId\" tabindex=\"1\" [appFocusRework]=\"focusMainArea\"\n\t\t\t(keypress)=\"keyControl($event)\"\n\t\t\t*ngIf=\"anonymizationHanlderService.displayableText\"\n\t\t\tclass=\"col-sm-10 sidenav\">\n\t\t\t<button type=\"button\" class=\"btn btn-secondary\">{{fileName}}</button>\n\t\t\t<div class=\"panel panel-default\">\n\t\t\t\t<div class=\"panel-body white fixed-panel\"\n\t\t\t\t\t(mouseup)=\"getSelectionText()\">\n\t\t\t\t\t<!-- *ngFor=\"let page of anonymizationHanlderService.displayableText\"-->\n\t\t\t\t\t<div\n\t\t\t\t\t\t[innerHtml]=\"anonymizationHanlderService.displayableText | highlightAnonymization:anonymizationHanlderService.getAnonymizations():trigger\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<span>{{selectedText}}</span>\n\t\t</div>\n\t\t<div class=\"col-sm-2\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-5\">\n\t\t\t\t\t<h4>Steuerung:</h4>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-1\"></div>\n\t\t\t\t<div class=\"col-sm-5\">\n\t\t\t\t\t<table>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t<td><button type=\"button\" class=\"btn btn-sq-sm btn-default\">w</button></td>\n\t\t\t\t\t\t\t<td></td>\n\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><button type=\"button\" class=\"btn btn-sq-sm btn-default\">a</button></td>\n\t\t\t\t\t\t\t<td><button type=\"button\" class=\"btn btn-sq-sm btn-default\">s</button></td>\n\t\t\t\t\t\t\t<td><button type=\"button\" class=\"btn btn-sq-sm btn-default\">d</button></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-8 col-md-offset-2\">\n\t\t\t\t\t<table>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><button type=\"button\"\n\t\t\t\t\t\t\t\t\tclass=\"btn btn-sq-lg btn-default btn-lg\">a</button></td>\n\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<h4>\n\t\t\t\t\t\t\t\t\t:&nbsp;<b>a</b>ccept\n\t\t\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><button type=\"button\"\n\t\t\t\t\t\t\t\t\tclass=\"btn btn-sq-lg btn-default btn-lg\">d</button></td>\n\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<h4>\n\t\t\t\t\t\t\t\t\t:&nbsp;<b>d</b>ecline\n\t\t\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><button type=\"button\"\n\t\t\t\t\t\t\t\t\tclass=\"btn btn-sq-lg btn-default btn-lg\">w</button></td>\n\t\t\t\t\t\t\t<td><h4>\n\t\t\t\t\t\t\t\t\t:&nbsp;re<b>w</b>ork\n\t\t\t\t\t\t\t\t</h4></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><button type=\"button\"\n\t\t\t\t\t\t\t\t\tclass=\"btn btn-sq-lg btn-default btn-lg\">s</button></td>\n\t\t\t\t\t\t\t<td><h4>\n\t\t\t\t\t\t\t\t\t:&nbsp;<b>s</b>ave\n\t\t\t\t\t\t\t\t</h4></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<hr>\n\t\t\t<div *ngIf=\"anonymizationHanlderService.getActuallyReworking()\"\n\t\t\t\t(keyup.enter)=\"enterRework()\">\n\t\t\t\t<table>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td><h4>Annotation:</h4></td>\n\t\t\t\t\t</tr>\n\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td><div\n\t\t\t\t\t\t\t\t[innerHtml]=\"anonymizationHanlderService.generateColorForLabel(\n\t\t\t\t\t\t\t\tanonymizationHanlderService.getActuallyReworking().data.label, \n\t\t\t\t\t\t\t\tanonymizationHanlderService.getActuallyReworking().data.original, \n\t\t\t\t\t\t\t\ttrue)\"></div></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td><h3>Label:</h3></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td><select [appFocusRework]=\"focusReworkArea\"\n\t\t\t\t\t\t\t[(ngModel)]=\"anonymizationHanlderService.getActuallyReworking().data.label\"\n\t\t\t\t\t\t\tclass=\"form-control\"><option\n\t\t\t\t\t\t\t\t\t*ngFor=\"let label of anonymizationHanlderService.getLabels()\">{{label}}</option>\n\t\t\t\t\t\t</select></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td><h3>Ersetzung:</h3></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td><input type=\"text\" class=\"form-control\" id=\"ersetzung\"\n\t\t\t\t\t\t\t[(ngModel)]=\"anonymizationHanlderService.getActuallyReworking().data.replacement\"></td>\n\t\t\t\t\t</tr>\n\n\n\t\t\t\t</table>\n\n\t\t\t\t<a>Just hit 'Enter' to accept the changes!</a>\n\n\t\t\t\t<hr>\n\t\t\t\t<h4>Farblegende:</h4>\n\t\t\t\t<ul>\n\t\t\t\t\t<li *ngFor=\"let label of anonymizationHanlderService.getLabels()\">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t[innerHtml]=\"anonymizationHanlderService.generateColorForLabel(label,label,true)\"></div>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n"

/***/ }),

/***/ "./src/app/control.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__anonymization__ = __webpack_require__("./src/app/anonymization.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__anonymization_handler_service__ = __webpack_require__("./src/app/anonymization-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__http_service__ = __webpack_require__("./src/app/http.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ControlComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ControlComponent = (function () {
    function ControlComponent(httpService, anonymizationHanlderService, activatedRoute) {
        var _this = this;
        this.httpService = httpService;
        this.anonymizationHanlderService = anonymizationHanlderService;
        this.activatedRoute = activatedRoute;
        this.trigger = 0;
        this.focusReworkArea = new __WEBPACK_IMPORTED_MODULE_2__angular_core__["F" /* EventEmitter */]();
        this.focusMainArea = new __WEBPACK_IMPORTED_MODULE_2__angular_core__["F" /* EventEmitter */]();
        activatedRoute.params.subscribe(function (param) { return _this.param = param.id; });
        console.log(this.param);
        if (this.param === undefined || this.param === '') {
            console.log('no param found.');
        }
        else {
            this.httpService.getDocument(this.param).then(function (response) {
                return _this.setUpFromDocument(response);
            });
        }
        this.focusMainArea.emit(true);
    }
    ControlComponent.prototype.updatePipe = function () {
        this.trigger++;
    };
    /**
     * Uploads the file to the backend and sets up the needed elements from the response
     * @param event contains the uploaded files
     */
    ControlComponent.prototype.fileHandle = function (event) {
        var _this = this;
        var files = event.target.files || event.srcElement.files;
        console.log(files);
        this.httpService.postFile(files).then(function (response) {
            return _this.setUpFromDocument(response);
        });
    };
    ControlComponent.prototype.setUpFromDocument = function (document) {
        this.fileName = document.fileName;
        this.docId = document.id;
        this.docFileType = document.originalFileType;
        for (var i = 0; i < document.anonymizations.length; ++i) {
            document.anonymizations[i].id = i + 1;
        }
        this.anonymizationHanlderService.setUpParams(document.displayableText, document.anonymizations);
    };
    /**
     * Handles the operations on keypress (like a for accept)
     * @param event the catched keyboard event to check which key is pressed
     */
    ControlComponent.prototype.keyControl = function (event) {
        switch (event.charCode) {
            case 97:
                console.log('pressed a');
                this.anonymizationHanlderService.acceptedActualAnonymization();
                this.updatePipe();
                this.httpService.saveFile(this.anonymizationHanlderService.getAnonymizations(), this.docId);
                break;
            case 119:
                console.log('pressed w');
                this.focusReworkArea.emit(true);
                break;
            case 100:
                console.log('pressed d');
                this.anonymizationHanlderService.declineActualAnonymization();
                this.updatePipe();
                this.httpService.saveFile(this.anonymizationHanlderService.getAnonymizations(), this.docId);
                break;
            case 115:
                console.log('pressed s');
                if (this.anonymizationHanlderService.getActuallyReworking() === undefined) {
                    if (window.confirm('Wirklich fertig?')) {
                        this.httpService.exportFile(this.docId);
                        this.anonymizationHanlderService.resetDisplayableText();
                    }
                }
                else {
                    window.alert('Es sind noch offene Anonymisierungen vorhanden!');
                    console.log('Document not finished!');
                }
                break;
            default:
        }
    };
    /**
     * Sets the focus back to the main area if 'enter' was pressed in the rework area.
     * In addition calls the necessary handler function for the reworked or added anonymization.
     */
    ControlComponent.prototype.enterRework = function () {
        console.log('Hit Enter!');
        this.focusMainArea.emit(true);
        if (this.anonymizationHanlderService.getActuallyReworking().id === (this.anonymizationHanlderService.getMaxId() + 1)) {
            console.log('add new anonymization!');
            this.anonymizationHanlderService.addedNewAnonymization();
        }
        else {
            this.anonymizationHanlderService.reworkedActualAnonymization();
        }
        this.updatePipe();
        this.httpService.saveFile(this.anonymizationHanlderService.getAnonymizations(), this.docId);
    };
    /**
     * Sets up a new anonymization with HUMAN as producer if something of the text
     * is selected.
     */
    ControlComponent.prototype.getSelectionText = function () {
        console.log('getSelectionText Entered.');
        var selectedText;
        if (window.getSelection) {
            selectedText = window.getSelection();
        }
        else if (document.getSelection) {
            selectedText = document.getSelection();
        }
        // first check for wrong selections
        if (String(selectedText) === '' || String(selectedText) === ' ') {
            return;
        }
        this.tempAnonymization = new __WEBPACK_IMPORTED_MODULE_0__anonymization__["a" /* Anonymization */]();
        this.tempAnonymization.data.original = selectedText.toString();
        this.tempAnonymization.data.label = 'UNKNOWN';
        this.tempAnonymization.data.replacement = '';
        this.tempAnonymization.producer = 'HUMAN';
        this.tempAnonymization.status = 'PROCESSING';
        this.tempAnonymization.id = this.anonymizationHanlderService.getMaxId() + 1;
        this.anonymizationHanlderService.setActualleReworking(this.tempAnonymization);
        this.anonymizationHanlderService.setTemporatyAnonymization();
        this.updatePipe();
        this.focusReworkArea.emit(true);
    };
    return ControlComponent;
}());
ControlComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_14" /* Component */])({
        selector: 'app-control',
        template: __webpack_require__("./src/app/control.component.html"),
        styles: [__webpack_require__("./src/app/control.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_3__http_service__["a" /* HttpService */], __WEBPACK_IMPORTED_MODULE_1__anonymization_handler_service__["a" /* AnonymizationHandlerService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__http_service__["a" /* HttpService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__http_service__["a" /* HttpService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__anonymization_handler_service__["a" /* AnonymizationHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__anonymization_handler_service__["a" /* AnonymizationHandlerService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* ActivatedRoute */]) === "function" && _c || Object])
], ControlComponent);

var _a, _b, _c;
//# sourceMappingURL=control.component.js.map

/***/ }),

/***/ "./src/app/focus-main.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FocusMainDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

var FocusMainDirective = (function () {
    function FocusMainDirective(element, renderer) {
        this.element = element;
        this.renderer = renderer;
    }
    FocusMainDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.appFocusMain.subscribe(function (event) {
            _this.renderer.invokeElementMethod(_this.element.nativeElement, 'focus', []);
        });
    };
    return FocusMainDirective;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* EventEmitter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* EventEmitter */]) === "function" && _a || Object)
], FocusMainDirective.prototype, "appFocusMain", void 0);
FocusMainDirective = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* Directive */])({
        selector: '[appFocusMain]'
    }),
    __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */])),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["N" /* Renderer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["N" /* Renderer */]) === "function" && _c || Object])
], FocusMainDirective);

var _a, _b, _c;
//# sourceMappingURL=focus-main.directive.js.map

/***/ }),

/***/ "./src/app/focus-rework.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FocusReworkDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

var FocusReworkDirective = (function () {
    function FocusReworkDirective(element, renderer) {
        this.element = element;
        this.renderer = renderer;
    }
    FocusReworkDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.appFocusRework.subscribe(function (event) {
            _this.renderer.invokeElementMethod(_this.element.nativeElement, 'focus', []);
        });
    };
    return FocusReworkDirective;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* EventEmitter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* EventEmitter */]) === "function" && _a || Object)
], FocusReworkDirective.prototype, "appFocusRework", void 0);
FocusReworkDirective = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* Directive */])({
        selector: '[appFocusRework]'
    }),
    __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */])),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["N" /* Renderer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["N" /* Renderer */]) === "function" && _c || Object])
], FocusReworkDirective);

var _a, _b, _c;
//# sourceMappingURL=focus-rework.directive.js.map

/***/ }),

/***/ "./src/app/highlight-anonymization.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__anonymization_handler_service__ = __webpack_require__("./src/app/anonymization-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HighlightAnonymizationPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HighlightAnonymizationPipe = (function () {
    function HighlightAnonymizationPipe(anonymizationHanlderService, sanitizer) {
        this.anonymizationHanlderService = anonymizationHanlderService;
        this.sanitizer = sanitizer;
    }
    /**
     * Finds the originals of the anonymizations from the list (with regex) and replaces them in the
     * displayable text by a <span> element to set a background color according to the Label of the
     * anonymization. If the anonymization is the next one then there
     * are added red marks before and after to mark the actually looked at.
     *
     * @param value is the text which is actually piped in the view
     * @param anonymizations is the list of anonymizations which should be highlighted
     * @param trigger a number which is incremented to trigger the pipe function
     * @return html with the originals replaced by the <span> object to highlight it
     */
    HighlightAnonymizationPipe.prototype.transform = function (value, anonymizations, trigger) {
        console.log('Pipe highlightAnonymization entered.');
        var newValue = value;
        var replacement = '';
        for (var i = 0; i < anonymizations.length; ++i) {
            replacement = '';
            if (this.anonymizationHanlderService.findAnonymizationsByStatus('ACCEPTED').includes(anonymizations[i].id)) {
                replacement = '<span style="background-color:DarkGrey">' + anonymizations[i].data.replacement + '</span>';
            }
            else if (this.anonymizationHanlderService.findAnonymizationsByStatus('DECLINED').includes(anonymizations[i].id)) {
                replacement = '<span style="background-color:rgb(242, 250, 255)">' + anonymizations[i].data.original + '</span>';
            }
            else {
                if (anonymizations[i].id === this.anonymizationHanlderService.getActuallyReworking().id) {
                    replacement = '<span style="background-color:rgb(255,0,0)">O</span>';
                }
                replacement += this.anonymizationHanlderService.generateColorForLabel(anonymizations[i].data.label, anonymizations[i].data.original.replace(/\n/g, '<br/>'), false);
                if (anonymizations[i].id === this.anonymizationHanlderService.getActuallyReworking().id) {
                    replacement += '<span style="background-color:rgb(255,0,0)">O</span>';
                }
            }
            newValue = newValue.replace(new RegExp(this.anonymizationHanlderService.formRegexFromOriginal(anonymizations[i].data.original), 'g'), replacement);
        }
        return this.sanitizer.bypassSecurityTrustHtml(newValue);
    };
    return HighlightAnonymizationPipe;
}());
HighlightAnonymizationPipe = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Y" /* Pipe */])({
        name: 'highlightAnonymization'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__anonymization_handler_service__["a" /* AnonymizationHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__anonymization_handler_service__["a" /* AnonymizationHandlerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]) === "function" && _b || Object])
], HighlightAnonymizationPipe);

var _a, _b;
//# sourceMappingURL=highlight-anonymization.pipe.js.map

/***/ }),

/***/ "./src/app/http.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__("./node_modules/rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HttpService = (function () {
    function HttpService(http) {
        this.http = http;
        this.exportAccessed = false;
        this.lockedExport = false;
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({});
        this.options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]();
    }
    /**
     * Loads all labels from the backend to have the actual ones
     * @return Promise<string[]> a promise containing a list of strings (label names)
     */
    HttpService.prototype.getLabels = function () {
        var url = '/api/labels';
        return this.http.get(url).toPromise().then(function (response) { return response.json(); }).catch(this.handleError);
    };
    /**
   * Loads all labels from the backend to have the actual ones
   * @return Promise<string[]> a promise containing a list of strings (label names)
   */
    HttpService.prototype.getDocument = function (id) {
        var url = '/api/document/' + id;
        return this.http.get(url).toPromise().then(function (response) { return response.json(); }).catch(this.handleError);
    };
    /**
     * Sends the uploaded file as formData and get back the processed file as document object to display it
     * @param files the actually uploaded file/s
     * @return Promise<Document> a promise containing the processed file as Document object
     */
    HttpService.prototype.postFile = function (files) {
        var url = '/api/upload';
        var formData = new FormData();
        this.options.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        for (var i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
        return this.http.post(url, formData, this.options)
            .toPromise().then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    /**
     * Sends the manually reworked anonymizations to the backend to update the document.
     * Additionally calls the api path for the export of the anonymized document.
     * @param anonymizations a list of updated and added anonymizations
     * @param id of the document in progress
     */
    HttpService.prototype.saveFile = function (anonymizations, id) {
        var _this = this;
        this.lockedExport = true;
        var url = '/api/update/anonymizations/' + id;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        this.http.post(url, JSON.stringify(anonymizations), { headers: headers })
            .toPromise().then(function (Response) {
            _this.lockedExport = false;
            if (_this.exportAccessed) {
                _this.exportFile(id);
            }
        })
            .catch(this.handleError);
    };
    HttpService.prototype.exportFile = function (id) {
        if (this.lockedExport) {
            this.exportAccessed = true;
            return;
        }
        window.location.replace('api/save/' + id);
        this.exportAccessed = false;
    };
    HttpService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    return HttpService;
}());
HttpService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === "function" && _a || Object])
], HttpService);

var _a;
//# sourceMappingURL=http.service.js.map

/***/ }),

/***/ "./src/app/replacement.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Replacement; });
var Replacement = (function () {
    function Replacement() {
    }
    return Replacement;
}());

//# sourceMappingURL=replacement.js.map

/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[1]);
//# sourceMappingURL=main.bundle.js.map
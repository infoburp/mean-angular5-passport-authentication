"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var cause_component_1 = require("./../cause/cause.component");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var http_1 = require("@angular/common/http");
var EffectComponent = (function () {
    function EffectComponent(http, router, dialog, route) {
        this.http = http;
        this.router = router;
        this.dialog = dialog;
        this.route = route;
        this.displayedColumns = [
            "sentiment",
            "name",
            /*"created_by",*/
            "created_at",
            "view",
            "delete"
        ];
        this.effects = [];
        this.data = { children: [] };
        this.name = "";
        this.sentiment = 0;
    }
    EffectComponent.prototype.ngOnInit = function () {
        var id = this.route.snapshot.paramMap.get('id');
        this.getEffects();
    };
    EffectComponent.prototype.getEffects = function () {
        var _this = this;
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.get("/api/effect", httpOptions).subscribe(function (data) {
            _this.effects = data;
            console.log(_this.effects);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    EffectComponent.prototype.getEffectById = function (effectId) {
        var _this = this;
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.get("/api/effect/" + effectId, httpOptions).subscribe(function (data) {
            _this.effects = data;
            console.log(_this.effects);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    EffectComponent.prototype.searchEffects = function (searchQuery) {
        var _this = this;
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.get("/api/effect/search/" + searchQuery, httpOptions).subscribe(function (data) {
            _this.effects = data;
            console.log(_this.effects);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    EffectComponent.prototype.expandEffect = function (effectId) {
        this.expandedEffect = effectId;
        console.log(this.expandedEffect);
    };
    EffectComponent.prototype.saveEffect = function (effect) {
        var _this = this;
        console.log(effect);
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.post("/api/effect", effect, httpOptions).subscribe(function (data) {
            // this.effects = data;
            console.log(data);
            _this.getEffects();
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    EffectComponent.prototype.viewEffect = function (effect) { };
    EffectComponent.prototype.deleteEffect = function (effect) { };
    EffectComponent.prototype.openDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(NewEffectDialog, {
            width: "480px",
            data: { name: this.name, sentiment: this.sentiment }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log("The dialog was closed");
            if (result) {
                console.log(result);
                _this.saveEffect(result);
            }
        });
    };
    EffectComponent.prototype.openCauseDialog = function (effect) {
        var _this = this;
        var dialogRef = this.dialog.open(cause_component_1.NewCauseDialog, {
            width: "480px",
            data: { name: "", sentiment: 0 }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log("The dialog was closed");
            if (result) {
                console.log(result);
                _this.saveCause(result, effect);
            }
        });
    };
    EffectComponent.prototype.saveCause = function (cause, effect) {
        var _this = this;
        console.log(cause);
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.post("/api/cause/" + effect._id, cause, httpOptions).subscribe(function (data) {
            // this.actions = data;
            console.log(data);
            _this.getEffects();
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    EffectComponent.prototype.logout = function () {
        localStorage.removeItem("jwtToken");
        this.router.navigate(["login"]);
    };
    EffectComponent = __decorate([
        core_1.Component({
            selector: "app-effect",
            templateUrl: "./effect.component.html",
            styleUrls: ["./effect.component.css"]
        })
    ], EffectComponent);
    return EffectComponent;
}());
exports.EffectComponent = EffectComponent;
var NewEffectDialog = (function () {
    function NewEffectDialog(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    NewEffectDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    NewEffectDialog = __decorate([
        core_1.Component({
            selector: "app-new-effect-dialog",
            templateUrl: "new-effect-dialog.html",
            styleUrls: ["./effect.component.css"]
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], NewEffectDialog);
    return NewEffectDialog;
}());
exports.NewEffectDialog = NewEffectDialog;

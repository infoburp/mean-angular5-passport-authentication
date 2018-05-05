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
var action_component_1 = require("../action/action.component");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var http_1 = require("@angular/common/http");
var CauseComponent = (function () {
    function CauseComponent(http, router, dialog) {
        this.http = http;
        this.router = router;
        this.dialog = dialog;
        this.displayedColumns = [
            "sentiment",
            "name",
            /* "created_by",*/ "created_at",
            "view",
            "delete"
        ];
        this.causes = [];
        this.data = { children: [] };
        this.name = "";
        this.sentiment = 0;
    }
    CauseComponent.prototype.ngOnInit = function () {
        this.getCauses();
    };
    CauseComponent.prototype.getCauses = function () {
        var _this = this;
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.get("/api/cause", httpOptions).subscribe(function (data) {
            _this.causes = data;
            console.log(_this.causes);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    CauseComponent.prototype.loadActions = function (cause) {
        var _this = this;
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem('jwtToken')
            })
        };
        this.data.children = [];
        this.http
            .get('/api/cause/' + cause._id + '/actions', httpOptions)
            .subscribe(function (data) {
            _this.data = data;
            console.log(data);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(['login']);
            }
        });
    };
    CauseComponent.prototype.saveCause = function (cause) {
        var _this = this;
        console.log(cause);
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem('jwtToken')
            })
        };
        this.http.post('/api/cause', cause, httpOptions).subscribe(function (data) {
            // this.causes = data;
            console.log(data);
            _this.getCauses();
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(['login']);
            }
        });
    };
    CauseComponent.prototype.openDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(NewCauseDialog, {
            width: '480px',
            data: { name: this.name, sentiment: this.sentiment }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
            if (result) {
                console.log(result);
                _this.saveCause(result);
            }
        });
    };
    CauseComponent.prototype.openActionDialog = function (cause) {
        var _this = this;
        var dialogRef = this.dialog.open(action_component_1.NewActionDialog, {
            width: '480px',
            data: { name: '', sentiment: 0 }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
            if (result) {
                console.log(result);
                _this.saveAction(result, cause);
            }
        });
    };
    CauseComponent.prototype.saveAction = function (action, cause) {
        var _this = this;
        console.log(action);
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem('jwtToken')
            })
        };
        this.http.post('/api/action/' + cause._id, action, httpOptions).subscribe(function (data) {
            // this.actions = data;
            console.log(data);
            _this.loadActions(cause);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(['login']);
            }
        });
    };
    CauseComponent.prototype.logout = function () {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['login']);
    };
    CauseComponent.prototype.viewCause = function (cause) { };
    CauseComponent.prototype.deleteCause = function (cause) { };
    CauseComponent = __decorate([
        core_1.Component({
            selector: "app-cause",
            templateUrl: "./cause.component.html",
            styleUrls: ["./cause.component.css"]
        })
    ], CauseComponent);
    return CauseComponent;
}());
exports.CauseComponent = CauseComponent;
var NewCauseDialog = (function () {
    function NewCauseDialog(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    NewCauseDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    NewCauseDialog = __decorate([
        core_1.Component({
            selector: 'app-new-cause-dialog',
            templateUrl: 'new-cause-dialog.html',
            styleUrls: ['./cause.component.css']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], NewCauseDialog);
    return NewCauseDialog;
}());
exports.NewCauseDialog = NewCauseDialog;

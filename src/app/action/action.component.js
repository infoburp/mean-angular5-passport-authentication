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
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var http_1 = require("@angular/common/http");
var ActionComponent = (function () {
    function ActionComponent(http, router, dialog) {
        this.http = http;
        this.router = router;
        this.dialog = dialog;
        this.displayedColumns = [
            "sentiment",
            "name",
            /*'created_by',*/ "created_at",
            "view",
            "delete"
        ];
        this.actions = [];
        this.causes = [];
        this.effects = [];
        this.name = "";
        this.sentiment = 0;
    }
    ActionComponent.prototype.ngOnInit = function () {
        this.getActions();
    };
    ActionComponent.prototype.getActions = function () {
        var _this = this;
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.get("/api/action", httpOptions).subscribe(function (data) {
            _this.actions = data;
            console.log(_this.actions);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    ActionComponent.prototype.loadDetails = function (action) {
        console.log(action);
        this.loadCauses(action);
        this.loadEffects(action);
    };
    ActionComponent.prototype.loadCauses = function (action) {
        var _this = this;
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.causes = null;
        this.http
            .get("/api/action/" + action._id + "/causes", httpOptions)
            .subscribe(function (data) {
            _this.causes = data;
            console.log(_this.causes);
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    ActionComponent.prototype.loadEffects = function (action) {
        /*let httpOptions = {
          headers: new HttpHeaders({
            Authorization: localStorage.getItem("jwtToken")
          })
        };
        this.effects = null;
        this.http
          .get("/api/action/" + action._id + "/effects", httpOptions)
          .subscribe(
            data => {
              this.effects = data;
              console.log(this.effects);
            },
            err => {
              if (err.status === 401) {
                this.router.navigate(["login"]);
              }
            }
          );*/
    };
    ActionComponent.prototype.deleteAction = function (action) {
        console.log(action);
    };
    ActionComponent.prototype.saveAction = function (action) {
        var _this = this;
        console.log(action);
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                Authorization: localStorage.getItem("jwtToken")
            })
        };
        this.http.post("/api/action", action, httpOptions).subscribe(function (data) {
            // this.actions = data;
            console.log(data);
            _this.getActions();
        }, function (err) {
            if (err.status === 401) {
                _this.router.navigate(["login"]);
            }
        });
    };
    ActionComponent.prototype.newDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(NewActionDialog, {
            width: "480px",
            data: { name: this.name, sentiment: this.sentiment }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log("The dialog was closed");
            if (result) {
                console.log(result);
                _this.saveAction(result);
            }
        });
    };
    ActionComponent.prototype.deleteDialog = function (action) {
        var _this = this;
        var dialogRef = this.dialog.open(DeleteActionDialog, {
            width: "480px",
            data: { action: action }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log("The dialog was closed");
            if (result) {
                console.log(result);
                _this.deleteAction(result);
            }
        });
    };
    ActionComponent.prototype.logout = function () {
        localStorage.removeItem("jwtToken");
        this.router.navigate(["login"]);
    };
    ActionComponent = __decorate([
        core_1.Component({
            selector: "app-action",
            templateUrl: "./action.component.html",
            styleUrls: ["./action.component.css"]
        })
    ], ActionComponent);
    return ActionComponent;
}());
exports.ActionComponent = ActionComponent;
var NewActionDialog = (function () {
    function NewActionDialog(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    NewActionDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    NewActionDialog = __decorate([
        core_1.Component({
            selector: "app-new-action-dialog",
            templateUrl: "new-action-dialog.html",
            styleUrls: ["./action.component.css"]
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], NewActionDialog);
    return NewActionDialog;
}());
exports.NewActionDialog = NewActionDialog;
var DeleteActionDialog = (function () {
    function DeleteActionDialog(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    DeleteActionDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DeleteActionDialog = __decorate([
        core_1.Component({
            selector: "app-delete-action-dialog",
            templateUrl: "delete-action-dialog.html",
            styleUrls: ["./action.component.css"]
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], DeleteActionDialog);
    return DeleteActionDialog;
}());
exports.DeleteActionDialog = DeleteActionDialog;

window.Modals=function(){function o(o,t,e){var s={close:".js-modal-close",open:".js-modal-open-"+t,openClass:"modal--is-active"};if(this.$modal=$("#"+o),!this.$modal.length)return!1;this.nodes={$parent:$("html").add("body")},this.config=$.extend(s,e),this.modalIsOpen=!1,this.$focusOnOpen=this.config.focusOnOpen?$(this.config.focusOnOpen):this.$modal,this.init()}return o.prototype.init=function(){$(this.config.open).attr("aria-expanded","false"),$(this.config.open).on("click",$.proxy(this.open,this)),this.$modal.find(this.config.close).on("click",$.proxy(this.close,this))},o.prototype.open=function(o){var t=!1;this.modalIsOpen||(o?o.preventDefault():t=!0,o&&o.stopPropagation&&(o.stopPropagation(),this.$activeSource=$(o.currentTarget)),this.modalIsOpen&&!t&&this.close(),this.$modal.addClass(this.config.openClass),this.nodes.$parent.addClass(this.config.openClass),this.modalIsOpen=!0,slate.a11y.trapFocus({$container:this.$modal,$elementToFocus:this.$focusOnOpen,namespace:"modal_focus"}),this.$activeSource&&this.$activeSource.attr("aria-expanded")&&this.$activeSource.attr("aria-expanded","true"),this.bindEvents())},o.prototype.close=function(){this.modalIsOpen&&($(document.activeElement).trigger("blur"),this.$modal.removeClass(this.config.openClass),this.nodes.$parent.removeClass(this.config.openClass),this.modalIsOpen=!1,slate.a11y.removeTrapFocus({$container:this.$modal,namespace:"modal_focus"}),this.$activeSource&&this.$activeSource.attr("aria-expanded")&&this.$activeSource.attr("aria-expanded","false").focus(),this.unbindEvents())},o.prototype.bindEvents=function(){this.nodes.$parent.on("keyup.modal",$.proxy(function(o){27===o.keyCode&&this.close()},this))},o.prototype.unbindEvents=function(){this.nodes.$parent.off(".modal")},o}(),$(function(){var o=$("#LoginModal");if(o.length){var t=new window.Modals("LoginModal","login-modal",{focusOnOpen:"#Password"});o.find(".errors").length&&t.open()}});
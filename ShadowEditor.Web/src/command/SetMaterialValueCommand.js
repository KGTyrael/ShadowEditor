import Command from './Command';

/**
 * 设置材质值命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */
function SetMaterialValueCommand(object, attributeName, newValue) {
	Command.call(this);

	this.type = 'SetMaterialValueCommand';
	this.name = 'Set Material.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.oldValue = (object !== undefined) ? object.material[attributeName] : undefined;
	this.newValue = newValue;
	this.attributeName = attributeName;
};

SetMaterialValueCommand.prototype = Object.create(Command.prototype);

Object.assign(SetMaterialValueCommand.prototype, {
	constructor: SetMaterialValueCommand,

	execute: function () {
		this.object.material[this.attributeName] = this.newValue;
		this.object.material.needsUpdate = true;
		this.editor.app.call('objectChanged', this, this.object);
		this.editor.app.call('materialChanged', this, this.object.material);
	},

	undo: function () {
		this.object.material[this.attributeName] = this.oldValue;
		this.object.material.needsUpdate = true;
		this.editor.app.call('objectChanged', this, this.object);
		this.editor.app.call('materialChanged', this, this.object.material);
	},

	update: function (cmd) {
		this.newValue = cmd.newValue;
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
		this.object = this.editor.objectByUuid(json.objectUuid);
	}
});

export default SetMaterialValueCommand;

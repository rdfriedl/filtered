import NodeManager from 'core/NodeManager';
import Node from 'core/Node';
import Input from 'core/Input';
import Output from 'core/Output';

describe('NodeManager', function () {
	before(function(){
		this.manager = new NodeManager();
	});

	describe('addNode', function () {
		afterEach(function(){
			this.manager.clearNodes();
		});

		it('adds the node', function () {
			var node = new Node();
			this.manager.addNode(node);

			expect(this.manager.hasNode(node)).to.true;
		});
	});

	describe('removeNode', function () {
		beforeEach(function(){
			this.node = new Node();
			this.manager.addNode(this.node);
		});

		it('removes the node', function () {
			this.manager.removeNode(this.node);
			expect(this.manager.hasNode(this.node)).to.be.false;
		});
	});

	describe('clearNodes', function () {
		it('removes all nodes', function () {
			this.manager.addNode(new Node());
			this.manager.addNode(new Node());
			expect(this.manager.nodes).to.have.length.above(0);
			this.manager.clearNodes();
			expect(this.manager.nodes).to.have.lengthOf(0);
		});
	});

	describe('hasInput', function () {
		before(function () {
			this.node = new Node();
			this.input = new Input('input-1');
			this.node.addInput(this.input);
			this.manager.addNode(this.node);
		});

		it('get input by name', function () {
			expect(this.manager.hasInput('input-1')).to.be.true;
		});

		it('gets input by class', function () {
			expect(this.manager.hasInput(Input)).to.be.true;
		});

		it('get input by instance', function () {
			expect(this.manager.hasInput(this.input)).to.be.true;
		});
	});

	describe('hasOutput', function () {
		before(function () {
			this.node = new Node();
			this.output = new Output('output-1');
			this.node.addOutput(this.output);
			this.manager.addNode(this.node);
		});

		it('get output by name', function () {
			expect(this.manager.hasOutput('output-1')).to.be.true;
		});

		it('gets output by class', function () {
			expect(this.manager.hasOutput(Output)).to.be.true;
		});

		it('get output by instance', function () {
			expect(this.manager.hasOutput(this.output)).to.be.true;
		});
	});
});

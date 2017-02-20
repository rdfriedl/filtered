import NodeManager from 'core/NodeManager';
import Node from 'core/Node';

describe('NodeManager', function () {
	before(function(){
		this.manager = new NodeManager();
	})

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
});

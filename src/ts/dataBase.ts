import Dexie from 'dexie';

export default class DataBase{
	init(){
		//create db
    	this.db = new Dexie('Filtered');
	    this.db.version(1)
	        .stores({
	            filters: '++id, name, saved, data'
	        });

	    // Open the database
	    this.db.open()
	        .catch(function(error){
	            console.error('DB: ' + error);
	        });
	}

	static get inst(){
		return this._instance || (this._instance = new DataBase());
	}

	getSaves(){
		return []
	}
}

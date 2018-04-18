const mongoose = require('mongoose');

const userShema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type: String,
		required: true,
		// unique não é uma validação.
		// O BD vai criar um index pra ele quando for buscar, e isso melhora a performance
		// Porém não é validação.
		unique: true,	

		// Match é para validar o padrão do texto.
		// Essa ReGex serve para validar e ver se o que foi submetido é um email mesmo
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	},
	password:{
		type:String,
		required:true
	}
});

module.exports = mongoose.model('User', userShema);
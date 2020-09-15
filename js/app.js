class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}
	validarDados(){
		for(let i in this){
			if(this[i] == '' || this[i] == undefined || this[i] == null){
				return false
			}
		}
		return true
	}
}

class Bd {
	constructor(){
		let id = localStorage.getItem('id')
		if(id == null){
			localStorage.setItem('id', 0)
		}
	}
	getProximoItem(){
		let proximoItem = localStorage.getItem('id')
			return  parseInt(proximoItem) + 1
	}

	gravar(d){
		let id = this.getProximoItem()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}
	recuperarTodosRegistros(){
		let despesas = Array()
		let id = localStorage.getItem('id')
		for(let i = 1; i < id; i++){
			let despesa = JSON.parse(localStorage.getItem(i))
			if(despesa == null){
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}		
		return despesas
	}
	pesquisar(despesa){
		let despesasFiltradas = this.recuperarTodosRegistros()

		if(despesa.ano != ''){
		despesasFiltradas = despesasFiltradas.filter(v => v.ano == despesa.ano)
		console.log('Filtro ano')
		}
		if(despesa.mes != ''){
		despesasFiltradas = despesasFiltradas.filter(v => v.mes == despesa.mes)
		console.log('Filtro mes')
		}
		if(despesa.dia != ''){
		despesasFiltradas = despesasFiltradas.filter(v => v.dia == despesa.dia)
		console.log('Filtro dia')
		}
		if(despesa.tipo != ''){
		despesasFiltradas = despesasFiltradas.filter(v => v.tipo == despesa.tipo)
		console.log('Filtro tipo')
		}
		if(despesa.descricao != ''){
		despesasFiltradas = despesasFiltradas.filter(v => v.descricao == despesa.descricao)
		console.log('Filtro descricao')
		}
		if(despesa.valor != ''){
		despesasFiltradas = despesasFiltradas.filter(v => v.valor == despesa.valor)
		console.log('Filtro valor')
		}
		return despesasFiltradas
	}
	remover (id){
		localStorage.removeItem(id)
	}

}

let bd = new Bd()


function cadastrarDespesas() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
	
	if(despesa.validarDados()){
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso.'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'	
		
		$('#modalRegistroDespesas').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

    } else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = ' Existem campos obrigatórios que não foram preenchidos!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		
		$('#modalRegistroDespesas').modal('show')	
	}
}	
	

function carregarDespesas(despesas = Array(), filtro = false) {

	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}

	console.log(despesas)

	let listaDespesas = document.getElementById('listaDespesas')
		listaDespesas.innerHTML = ''

	despesas.forEach(function (v){
		
		let linha = listaDespesas.insertRow()
			linha.insertCell(0).innerHTML = `${v.dia}/${v.mes}/${v.ano}`
			switch(v.tipo){
				case '1': v.tipo = 'Alimentação'
					break
				case '2': v.tipo = 'Educação'
					break
				case '3': v.tipo = 'Lazer'
					break
				case '4': v.tipo = 'Saúde'
					break
				case '5': v.tipo = 'Transporte'
					break				
			}
			linha.insertCell(1).innerHTML = v.tipo
			linha.insertCell(2).innerHTML = v.descricao
			linha.insertCell(3).innerHTML = v.valor

			let btn = document.createElement('button')
			btn.className = 'btn btn-danger'
			btn.innerHTML = '<i class="fas fa-times"></i>'
			btn.id = v.id
			btn.onclick = function (){
				let id = this.id
				bd.remover(id)
				window.location.reload()
			}

			linha.insertCell(4).append(btn)
	})
}

function pesquisarDespesas(){

	let ano = document.getElementById('ano')
	let dia = document.getElementById('mes')
	let mes = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
	
	let despesas = bd.pesquisar(despesa)
	carregarDespesas(despesas, true)
}

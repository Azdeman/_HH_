const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');

function next(specialization,special,city,chunk,gorod){
	if(specialization.length==special){
			return false;
				console.log('Парсинг закончен!');
	}else if(city == gorod.length-1){
	special++;
	city  = 0;
												
	fs.appendFile('spec.txt',spec_.name+"\n",(err)=>{});
	setTimeout(chunk,6000,city,special);
	}else{
	city++;
												
	//fs.appendFile('city.txt',city_.name+"\n",(err)=>{});
	setTimeout(chunk,6000,city,special);
	}

}

(function (){
var list_promise = new Promise((resolve,reject)=>{
	request('https://api.hh.ru/areas',(err,response,body)=>{
		let json  = JSON.parse(body);
		let strit = [];
			for(let i=0;i<json.length;i++){
					let areas = json[i].areas.length;
						for(var j=0;j<areas;j++){
								if(json[i].areas[j].areas.length==0){
									strit.push({"id":json[i].areas[j].id,"name":json[i].areas[j].name});
							}else{
								var len_a = json[i].areas[j].areas.length;
									for(var u=0;u<len_a;u++){
										strit.push({"id":json[i].areas[j].areas[u].id,"name":json[i].areas[j].areas[u].name});
									}
								}
						}
			}
		return resolve(strit);	
	});
})	
list_promise.then((gorod)=>{
	request('https://api.hh.ru/specializations',async (err,response,body)=>{
		let json  = JSON.parse(body);
		let specialization = [];
			for(let i=0;i<json.length;i++){
					let specializ = json[i].specializations.length;
						for(var j=0;j<specializ;j++){
							specialization.push({"id":json[i].specializations[j].id,"name":json[i].specializations[j].name});
						}
			}
					function chunk(city,special){
						var spec_ = specialization[special],
							city_ = gorod[city],
							city = city,
							special = special;
							 
								let request_url = `https://api.hh.ru/vacancies?specialization=${spec_.id}&area=${city_.id}&per_page=100`;
						 			const options = {
									  url: request_url,
									  headers: {
									    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; APCPMS=^N201212031018021070621C1739358E8BDC3F_30134^; Trident/7.0; rv:11.0) like Gecko'
									  }
									};
							
							request(options,(err,response,data)=>{
								var append_id_info = [];

						/*
								#СБОР ИНФОРМАЦИИ
						*/
								var insert_info = ((next_id_)=>{
										if(next_id_ <= append_id_info.length){
													var next_id_  = next_id_;
													var id_vakansy = append_id_info[next_id_];
													var get_url_ = 'https://api.hh.ru/vacancies/'+id_vakansy;
													const options_inset_ = {
														  url: get_url_,
														  headers: {
														    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; APCPMS=^N201212031018021070621C1739358E8BDC3F_30134^; Trident/7.0; rv:11.0) like Gecko'
														  	}
														};
												request(options_inset_,(err,response,html)=>{
															var json_html = JSON.parse(html);

															if(json_html.name!=undefined){

																var title_vakansy = json_html.name,
																	title_description = json_html.description;

																if(json_html.contacts!=null){
																	var contacts_name = json_html.contacts.name,
																		contacts_email = json_html.contacts.email;
																}
																	


																	console.log(title_vakansy);

																next_id_++;
																setTimeout(insert_info,5000,next_id_)
															}else{
																next(specialization,special,city,chunk,gorod);
															}
												});

											}

									});
						/*
								#КОНЕЦ БЛОКА СБОР ИНФОРМАЦИИ
						*/

									var jsod_decode = JSON.parse(data);
											if(jsod_decode.items.length > 0){
												jsod_decode['items'].forEach(el=>{
																append_id_info.push(el.id); //добавляем id
															});
											}

									if(jsod_decode.items.length==100){
											var append_id_info = [];

						/*
								#СТРАНИЦЫ API
						*/

										var next_pagest = ((pages)=>{
											var pages = pages;
											
												let next_page_url = `https://api.hh.ru/vacancies?specialization=${spec_.id}&area=${city_.id}&per_page=100&page=`+pages;
												 const options_next_page = {
														  url: next_page_url,
														  headers: {
														    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; APCPMS=^N201212031018021070621C1739358E8BDC3F_30134^; Trident/7.0; rv:11.0) like Gecko'
														  }
													};
												request(options_next_page,(err,response,data_)=>{
													var jsod_decode_next_page = JSON.parse(data_);

														if(jsod_decode_next_page.items!=undefined){
																if(jsod_decode_next_page.items.length!=0){
															console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
															console.log('Специальность: '+spec_.name+' | Город: '+city_.name+' | Найдено Вакансий: '+jsod_decode_next_page.items.length+' | Всего городов: '+gorod.length+' | Провереннных городов: '+city +' | Страница: '+pages);
															//fs.appendFile('parsing.txt','Специальность: '+spec_.name+' | Город: '+city_.name+' | Найдено Вакансий: '+jsod_decode_next_page.items.length+' | Всего городов: '+gorod.length+' | Провереннных городов: '+city+"\n",(err)=>{});
																pages++; //увеличиваем счетчик страницы

															//парсим id
															
															jsod_decode_next_page['items'].forEach(el=>{
																append_id_info.push(el.id); //добавляем id
															});
																setTimeout(next_pagest,6000,pages); //смотрим следующую страницу
															}
														}else{
																insert_info(0); // считываем информацию
														}
												});
											});
									
						/*
								#КОНЕЦ СТРАНИЦЫ API
						*/
									next_pagest(1);

									}else{
											console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
											console.log('Специальность: '+spec_.name+' | Город: '+city_.name+' | Найдено Вакансий: '+jsod_decode.items.length+' | Всего городов: '+gorod.length+' | Провереннных городов: '+city);
											//fs.appendFile('parsing.txt','Специальность: '+spec_.name+' | Город: '+city_.name+' | Найдено Вакансий: '+jsod_decode.items.length+' | Всего городов: '+gorod.length+' | Провереннных городов: '+city+"\n",(err)=>{});
												console.log(jsod_decode.items.length+' '+append_id_info.length);
											if(jsod_decode.items.length > 0){	
												insert_info(0); // считываем информацию
											}else{
												next(specialization,special,city,chunk,gorod);
											}
										}
							});
					};
	chunk(0,0);
	

	});
});

})();

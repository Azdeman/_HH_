const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const mysql = require('mysql');


var connection = mysql.createPool({
    host     : '31.31.196.162',
    user     : 'u0476824_default',
    password : '6-ZP#g#0S7Nad26v%',
    database : 'u0476824_rabota_tut'
});

connection.query('SET CHARACTER SET utf8'); 

connection.query('select 1 + 1', (err, rows) => { /* */ });

function getReplace_(nt){
	return nt.replace(/[\'\"\~\`]/,'');
}

function select_info(sql_post_m){
	return new Promise((resolve,reject)=>{
		connection.query(sql_post_m,(err,result)=>{
			var json_i = JSON.parse(JSON.stringify(result));
						resolve(json_i);
				});
			});
}

function next(specialization,special,city,chunk,gorod,city_,spec_){
	if(special==62){
		console.log('Парсинг закончен!');
			return false;
	}else if(city == gorod.length-1){
	special++;
	city  = 0;
	fs.writeFileSync('current__.txt', city+'|'+special, (err) => {
							 	console.log(err);
								  if (err) throw err;
								  	console.log('The file has been saved!');
								  });
										
	fs.appendFile('spec.txt',spec_.name+"\n",(err)=>{});
	setTimeout(chunk,4000,city,special);
	}else{
	city++;
												
	fs.appendFile('city.txt',city_.name+"\n",(err)=>{});
	setTimeout(chunk,4000,city,special);
	}

}

(async function (){
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
							specialization.push({"parent":json[i].name,"id":json[i].specializations[j].id,"name":json[i].specializations[j].name});
						}
			}

					function chunk(city,special){
						var spec_ = specialization[special], // подкатегория
							city_ = gorod[city],
							city = city,
							special = special,
							specialize_category = spec_.parent; //категория
								
							 fs.writeFileSync('current__.txt', city+'|'+special, (err) => {
							 	
								  if (err) throw err;
								  	console.log('The file has been saved!');
								  });

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
										if(next_id_ < append_id_info.length){
											
													var next_id_  = next_id_;
													var id_vakansy = append_id_info[next_id_];
														id_vakansy = id_vakansy.id;
													var get_url_ = 'https://api.hh.ru/vacancies/'+id_vakansy;
													const options_inset_ = {
														  url: get_url_,
														  headers: {
														    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; APCPMS=^N201212031018021070621C1739358E8BDC3F_30134^; Trident/7.0; rv:11.0) like Gecko'
														  	}
														};
												request(options_inset_, async (err,response,html)=>{
															var json_html = JSON.parse(html);

															if(json_html.name!=undefined){
																// console.log(json_html.id);
																if(json_html.contacts!=null){
																	
																	if(json_html.contacts.phones!=null){
																		var phones = '';
																		json_html.contacts.phones.forEach(el=>{
																		    
																		    phones = '+'+el['country']+' ('+el['city']+') '+el['number'];
																		  
																		})
																	}

																	var vakansy_info = {
																		
																		'id_city'     : json_html.area.id,
																		'company'     : (json_html.employer!=null) ? json_html.employer.name : null,
																		'title'       : json_html.name,
																		'description' : json_html.description,
																		'salaryfrom'  : (json_html.salary!=null) ? json_html.salary.from : 0,
																		'salaryto'    : (json_html.salary!=null) ? json_html.salary.to : 0,
																		'currency'    : (json_html.salary!=null) ? json_html.salary.currency : null,
 																		'experience'  : (json_html.experience!=null) ? json_html.experience.name : '-',
																		'source_site' : (json_html.site!=null) ? json_html.site.name : '-',
																		'schedule' 	  : (json_html.schedule!=null) ? json_html.schedule.name : null,
																		'employment'  : (json_html.employment!=null) ? json_html.employment.name : null,
																		'contacter'   : json_html.contacts.name || null,
																		'email'   	  : json_html.contacts.email || '-',
																		'phones'	  : phones || null,
																		'require'     : append_id_info[next_id_].require,
																		'address'     : (json_html.address!=null) ? json_html.address.raw  : '-',
																		'city'        : city_.name

																	};
																	var vakansy_title = vakansy_info.title;
																	var info_url 	  = vakansy_info.title.replace(/(\s\/\s|\s[\(\)]\s)/g,'-');
																		info_url = info_url.replace(/[\/\s]/g,'-');
																		info_url = info_url.replace(/[\(\,\.\:\=\#\@)\?\$\#\!\+\,\[\]\|\~]/g,'').trim();
																		
																		vakansy_info.description = getReplace_(vakansy_info.description);
																		vakansy_title = getReplace_(vakansy_title);
																		info_url = getReplace_(info_url);
																		

																	var quid = 'http://rabota-tut.site/vakansii/'+info_url;
																	var sql_insert = "INSERT INTO `vp_posts` VALUES('','1',NOW(),NOW(),'"+vakansy_info.description+"','"+vakansy_title+"','','publish','closed','closed','','"+encodeURI(info_url)+"','','','','','','','"+encodeURI(quid)+"','','vakansii','','','"+city_.name+"')";
																	var sql_post_meta = "INSERT INTO `vp_postmeta` (post_id, meta_key, meta_value) VALUES ?";
																	var insertId__ = '';
																		

																	var sql_select_post_metas = "SELECT `post_content` FROM `vp_posts` WHERE `post_content` = '"+vakansy_info.description+"' AND `post_title` = '"+vakansy_title+"'";


																	var select_no_one = (async(sql_select_post_metas)=>{
																				return select_info(sql_select_post_metas);
																	});

																	select_no_one(sql_select_post_metas).then((els)=>{

																		if(els[0]==undefined || els[0].length == 0){

																	

																	var add_insert_vp_post = (async(sql_insert)=>{
																			return new Promise((resolve,reject)=>{
																				connection.query(sql_insert,(err,result)=>{
																						
																					insertId__ = result.insertId;
																					resolve(result.insertId);
																				});
																			});
																	});
																	

																	add_insert_vp_post(sql_insert).then((id_insert)=>{
																			var insert_vp_postmeta = [];
																			vakansy_info.address = getReplace_(vakansy_info.address);
																			vakansy_info.company = getReplace_(vakansy_info.company);

																			insert_vp_postmeta.push([id_insert,'vacancy',vakansy_title]);
																			insert_vp_postmeta.push([id_insert,'salaryfrom',vakansy_info.salaryfrom]);
																			insert_vp_postmeta.push([id_insert,'salaryto',vakansy_info.salaryto]);
																			insert_vp_postmeta.push([id_insert,'experience',vakansy_info.experience]);
																			insert_vp_postmeta.push([id_insert,'address',vakansy_info.address]);
																			insert_vp_postmeta.push([id_insert,'email',vakansy_info.email]);
																			insert_vp_postmeta.push([id_insert,'company',vakansy_info.company]);
																			insert_vp_postmeta.push([id_insert,'source_site',vakansy_info.source_site]);	
																			insert_vp_postmeta.push([id_insert,'contacter',vakansy_info.contacter]);
																			insert_vp_postmeta.push([id_insert,'phone',vakansy_info.phones]);

																		return new Promise((resolve,reject)=>{
																				connection.query(sql_post_meta,[insert_vp_postmeta],(err,result)=>{
																					resolve(id_insert);
																				});
																			});
																				
																	}).then((insert_id)=>{

																			var sql_post_m = "SELECT `term_taxonomy_id` FROM `vp_term_taxonomy` WHERE BINARY `description` = '"+spec_.parent.trim()+"'";
																				return select_info(sql_post_m);
																				
																			
																	}).then((parent_term_id)=>{

																		var json_i = parent_term_id;
																				
																		if(json_i.length > 1){
																				var sql_post_m = "SELECT `term_taxonomy_id` FROM `vp_term_taxonomy` WHERE BINARY `description` = '"+spec_.name+"'";
																				
																				return select_info(sql_post_m);
																		}else{
																				var parent_id_term = json_i[0]['term_taxonomy_id'];
																				var sql_post_m = "SELECT `term_taxonomy_id` FROM `vp_term_taxonomy` WHERE BINARY `description` = '"+spec_.name+"' AND `parent` = '"+parent_id_term+"'";
																						return select_info(sql_post_m);	
																			}

																	}).then((result)=>{
																			var term_taxonomy_id__ = result[0]['term_taxonomy_id'];
																			var sql_post_meta = "INSERT INTO `vp_term_relationships` VALUES ('"+insertId__+"','"+term_taxonomy_id__+"','0')";
																				return new Promise((resolve,reject)=>{
																					connection.query(sql_post_meta,(err,result)=>{
																						resolve(result.insertId);
																					});
																				});
																			
																	}).then((in_id)=>{
																			next_id_++;
																			setTimeout(insert_info,4000,next_id_);
																	})

																}else{
																		console.log('Такое объявление уже существует!');
																		next_id_++;
																			setTimeout(insert_info,4000,next_id_);
																}

																});
																	// fs.appendFile('titly.txt',json_html.name+"\n",(err)=>{});
																	console.log(vakansy_info);
																	

																	

																}else{
																	console.log(json_html.name + ' : Нет контактов!');
																		next_id_++;
																		setTimeout(insert_info,4000,next_id_);
																}

																

															}else{
																next(specialization,special,city,chunk,gorod,city_,spec_);

															}
												});

											}else{
												next(specialization,special,city,chunk,gorod,city_,spec_);
											}

									});
						/*
								#КОНЕЦ БЛОКА СБОР ИНФОРМАЦИИ
						*/

									var jsod_decode = JSON.parse(data);
											if(jsod_decode.items.length > 0){
												jsod_decode['items'].forEach(el=>{
																append_id_info.push({'id':el.id,'require':(el.snippet!=null) ? el.snippet.requirement : null}); //добавляем id
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
																append_id_info.push({'id':el.id,'require':(el.snippet!=null) ? el.snippet.requirement : null}); //добавляем id
															});
																setTimeout(next_pagest,4000,pages); //смотрим следующую страницу
															}else{
																insert_info(0);
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
											fs.appendFile('parsing.txt','Специальность: '+spec_.name+' | Город: '+city_.name+' | Найдено Вакансий: '+jsod_decode.items.length+' | Всего городов: '+gorod.length+' | Провереннных городов: '+city+"\n",(err)=>{});
												
											if(jsod_decode.items.length > 0){	
												insert_info(0); // считываем информацию
											}else{
												next(specialization,special,city,chunk,gorod,city_,spec_);
											}
										}
							});
					};
	
	fs.readFile('current__.txt','utf8',(err,data)=>{
		let exp = data.split('|');
		let city__ = +exp[0]
			special__ = +exp[1];

		chunk(city__,special__);
	});
	
	
	});
});

})();

$(function(){	
var body= $('body');
base = {
	scrollFixed:function(el,scrollId,opt){
		var opt= opt||{},elm = $(el),lemH = $(elm).offset();
	    $(scrollId||window).scroll(function() {
		   
	        var scrollTop = $(scrollId||window).scrollTop();
	        	
	        if (lemH.top < scrollTop) {
		        	elm.addClass('toFixed').css({'top':lemH.top,'left':lemH.left});
	        } else {
		         elm.removeClass('toFixed').removeAttr('style');
	        }
	    });
	},//end scrollFixed
	
	//panelWindow
	/*
		@panelName:panel class name
		@title: panel title
		@content: panel content
		@btn:function
		@ok:function
	*/
	panel:function(opt){
		var opt = opt||{};
		opt.before && opt.before();
		base.addMask();
		
		var panelTitle = opt.title||'panelTitle', 
			panelOk    = '<a class="barBtn">'+(opt.btnTxt||'ok')+'</a>',
			panelClose = '<a class="panelClose"><i class="material-icons">clear</i></a>', 
			panelHead  = (typeof(opt.header) == "undefined" || opt.header == true )?'<div class="panelHead"><h1 class="panelTitle">'+panelTitle+'</h1>'+panelClose+'</div>':panelClose,
			panelBox   = $('<div class="panel">'+panelHead+'<div class="panelContent">'+opt.content+'</div><div class="panelBar">'+panelOk+'</div></div>'),
			panelWidth = opt.width||'700px';
			marWidth   = opt.width/2 || '-350px';
		var mrleft,pwidth;
		
		console.log(false||true);
		if(panelWidth.indexOf('%') != -1){
			panelWidth = panelWidth.replace(/\%/g, '');
			pwidth =  panelWidth+'%';
			mrleft = (panelWidth-(2*panelWidth))/2+'%';
		}
		console.log(pwidth);
		panelBox.css({width:pwidth||'700px',left:'50%',marginLeft:mrleft||'-350px',top:opt.top||'20%'});
		
		opt.panelName!=undefined?panelBox.addClass(opt.panelName):'';
		
		
		$('body').append(panelBox);
		$('.panelClose').on('click',function(){
			panelBox.remove();
			base.removeMask();
			opt.after && opt.after();
		});
		$('.barBtn').on('click',function(){
			panelBox.remove();
			base.removeMask();
			opt.ok && opt.ok();
		});
	},
	addMask:function(){
		body.append('<div class="mask"></div>');
	},
	removeMask:function(){
		$('.mask').remove();	
	},
	tabs:function tabs(sel,cont){
		sel.eq(0).addClass('active');
		cont.hide();
		cont.eq(0).show(); 
		sel.on('click',function(e){
			e.preventDefault();
			var ind = $(this).index();
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			cont.eq(ind).show().siblings().hide();
			e.stopPropagation();
		});
	},//end tabs
	
	sliderMenu:function(elm){
		$(elm).on('click',function(event){
			var el = $(elm);
				$(this).find('ul').slideToggle();
			event.stopPropagation();
		});
		
	},//end sliderMenu
	
	anmToggle:function(elm,removeAnm,addAnm){
		$(elm).removeClass(removeAnm).addClass(addAnm);
	},
	
	outHide:function(elm,opt){
		var opt = opt || {};
		$(document).on('click',function(e){
			if(!$(e.target).closest(elm).length && $(e.target)!=elm&&!$(e.target).closest(opt.exclude).length && $(e.target)!=opt.exclude){
				base.anmToggle(elm,opt.removeAnm,opt.addAnm);
			}
			opt.reback&&opt.reback();
		});
	},
	
}

var common = {
	//Message
	messageWindow:function(){
		var msgBtn = $('#messageWindow');
		msgBtn.data('stat','true');
		msgBtn.on('click',function(){
			var stat = msgBtn.data('stat');
			switch(stat){
				case 'true':
					var viewLay = $('<div class="viewLayer" id="msgFrame"></div>');
					$('body').append(viewLay);
					viewLay.load('Message/messageList.html',function(){
						base.tabs($('.bookListBar a'),$('.messageBook>div'));
					});
					msgBtn.addClass('active').data('stat','open');
				break;
				case 'open':
					base.anmToggle('#messageList','sliderInRight','sliderOutRight');
					msgBtn.data('stat','false').removeClass('active');
				break;
				case 'false':
					base.anmToggle('#messageList','sliderOutRight','sliderInRight');
					msgBtn.data('stat','open').addClass('active');;
					
				break;
			}
			
		});
		$(document).on('click','.messageBook a',function(){
			var msgCont = $('.viewLayer').append('<div class="msgQt"></div>');
			$('.msgQt').load('Message/messageWindow.html',function(){
				//console.log($('.msgWindow').scrollTo()().top);
				var msgWindow = $('.msgWindow');
				$('#minMsg').on('click',function(){
					$(this).parent().parent().parent().addClass('minWinow');
				});
				$('#closeMsg').on('click',function(){
					base.anmToggle('.msgWindow','sliderInDown','sliderOutDown');
				});
				
				$('#sendMsgBtn').on('click',function(){
					var msgTmp = $(this).siblings().find('#msgInput').val();
					if(msgTmp!=''){
						$('#msgContent').append('<li class="selfMsg"><p>'+msgTmp+'</p><sub class="msgTime">now</sub></li>');
						$(this).siblings().find('#msgInput').val('');
					}
				});
			});
		
		});
		function sendMsg(){
			
		}
	},
	reminderList:function(){
		$('#toReminder').on('click',function(){
			var remiderList = $('<div class="reminderBox"></div>');
			$(this).addClass('active');
			$('body').append(remiderList);
			remiderList.load('Notifications/Notifications.html',function(){
				$('body').append(remiderList);
			});
			
		});
	}
}
$(function(){
	base.tabs($('.chooseDate a'),$('.dateBox>div'));
	base.tabs($('.mailGroup a'),$('.mailsiderCont>div'));
	
	//搜索
	$('#searchTo').on('click',function(){
		$('#searchPage').addClass('pageShow');
		$('#searchInput').focus();
	});
	//消息
	$('.closeSearch').click(function(){
		
		$('#searchPage').removeClass('pageShow');
	});
	
	$('.editMail').click(function(){
		$('.editMailPage').show();
	});

	
	var settings = {
		loadpage:function(){
			base.sliderMenu('.setMenu li');
			$('#singCont').load('Settings/BasicInformation.html',
			function(){
				base.scrollFixed('.setSiderbar','.setPage');
				base.scrollFixed('.setColTtitle','.setPage');
			});
			
			$('.setMenu a').click(function(event){
			if($(this).attr('href')!=""){
				var $this = $(this),
					links = $this.attr('href');
				$('#singCont').load(links,function(){
				base.scrollFixed('.setSiderbar','.setPage');
				base.scrollFixed('.setColTtitle','.setPage');
			});
				$('.setMenu li').removeClass('active');
				$this.parent().addClass('active');
			}
			return event.preventDefault();
			});
			
			
		}
	}
	settings.loadpage();
	
});
	common.messageWindow();
	common.reminderList();
	var inboxStat = false;
	$('.mailHead').on('click',function(){
		if(inboxStat){
			$('#mailDropMenu').removeClass('open');
			inboxStat = false;
		}else{
			$('#mailDropMenu').addClass('open');
			inboxStat = true;
		}
	});
	var mailContainer = $('#mailContainer');
	$(document).on('click','#showMailList a',function(){
		var siername = $(this).find('b').text();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		mailContainer.load('Mail/mailList.html',
			function(){
				$('#mailContTitle').text(siername);
				$('#mailingList a').on('click',function(){
					mailContainer.load('Mail/mailBody2.html',
						function(){
							$('#mailBosy').text(siername);
						}
					);	
				});
			}
			
		);	
	});
	$('#mailingList1 a').on('click',function(){
		mailContainer.load('Mail/mailBody.html',
			function(){
				$('#mailBosy').text(siername);
			}
		);	
	});
		
	
	//邮件右侧容器
	$(document).on('click','.messageTool',function(){
		$(this).siblings('.seletPanel').toggle();
	});
	
	$(document).on('click','.backMailList',function(){
		mailContainer.load('Mail/mailList.html');
	});
	
	$(document).on('click','#newMail',function(){
		
		$('body').append('<div class="mailWindowContainer" id="mailWindowContainer"></div>');
		$('#mailWindowContainer').load('Mail/newMail.html');	
	});
	
	$(document).on('click','#addBtn',function(){
		$('#addBox').show();
	});
	
	
	
});






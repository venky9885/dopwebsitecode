//-------------------------------------------------------------------
//This JQuery function is created to call JavaScript functions
// on document.ready event, from all JSPs
//-------------------------------------------------------------------

jQuery(document).ready(function (){
	//Add list of JavaScript functions which are required to be called on document.ready event
	// Function to highlight error rows
	highLightErrorRow();
	highLightErrorField();
	var dateFieldText;
	var dateFieldElement;
	var isDateIconClicked;
	
	// This function prevents the default action of buttons if there is type system error in any field
  	jQuery(":submit").click(function (event){  	
  		var element = document.getElementsByTagName('input');
  		for ( var j = 0; j < element.length; j++) {  		 		
			// if the id matches to the type system hidden field, prevent the default action of buttons
			if ((element[j].id.match(/^ERROR_HIDDEN_ROW_/)) || (element[j].id.match(/^ERROR_HIDDEN_FIELD_/)))  {		
				event.preventDefault();
			}
		}
  	});	
  	/**Start Investec CR104 for Error Highlighting**/ 
  	//Gets the text from a textbox in case of focus in  
  	var originalText;
  	jQuery('input[type="text"]').focusin(function() {
        originalText = jQuery(this).val();
        originalText = jQuery.trim(originalText);
    });
    //Checks if the text has changed in the textbox at focus out, then change the border color of this field
    jQuery('input[type="text"]').focusout(function() {
        newText = jQuery(this).val();
        newText = jQuery.trim(newText);
        if(originalText != newText){
        	changeFieldBorderColor(this);
        }
    });
    
    //Checks if there is change in the combo box's selected value, then change the border color of this field
    jQuery('select').change(function() {
  		changeFieldBorderColor(this);
	});
	
	//When the current window gets focus, if there is some Business exception
	//of date field corrected using date picker then change the respective 
	//field's border 
	jQuery(window).focus(function() {
  		if(isDateIconClicked){
  			if(isDateChanged(dateFieldElement, dateFieldText)){
  				changeFieldBorderColor(dateFieldElement);
  			}
  			isDateIconClicked = false;
  		}
	});
	
	//If an image with id containing FG is clicked and that image is inside a table and its nth level span
	//(going upwards towards the td - select last span which is also the parent of image)
	//has class ERROR_FIELD_BORDER (means there is a Business exception on this date field)
	//then set isDateIconClicked to true and store current date field's value to dateFieldText
	jQuery('img[id*="FG"]').click(function() {
		var tableElem = jQuery(this).closest('table');
		if(tableElem.html() != null){
			var elems = jQuery(this).parentsUntil("td");
			var nLevelSpan = elems[elems.length-1];	
			if(jQuery(nLevelSpan).hasClass('ERROR_FIELD_BORDER')){
				isDateIconClicked = true;
				var parentSpan = jQuery(this).parent().parent();
				var field = jQuery(parentSpan).children(":first");
				dateFieldText = jQuery(field).val();
				dateFieldText = jQuery.trim(dateFieldText);
				dateFieldElement = field;
			}
		}
	});
   /**End Investec CR104 for Error Highlighting**/ 
});

//-------------------------------------------------------------------
//This function checks if the date in dateFieldElement is changed 
//and returns an appropriate flag value
//-------------------------------------------------------------------

function isDateChanged(dateFieldElement, dateFieldText){
	var dateChanged = false;
	newDateFieldText = jQuery(dateFieldElement).val();
	newDateFieldText = jQuery.trim(newDateFieldText);
	if(dateFieldText != newDateFieldText){
		dateChanged = true;
	}
	return dateChanged;
}
/** Start Pop-up Bubble in case of field's inside table component - Investec CR86**/

//-------------------------------------------------------------------
//This function hides the pop-up bubble
//-------------------------------------------------------------------

function hideBubble() {
	var bubbleDivs = jQuery('div[id*="bubbleID_"]');
	var elemsToBeRemoved = new Array(); 
	var count = 0;
	for ( var j = 0; j < bubbleDivs.length; j++) {  		 		
		if (!jQuery(bubbleDivs[j]).next().hasClass('ERROR_FIELD_BORDER_TYPESYS'))  {		
			jQuery(bubbleDivs[j]).remove();
		}
	} 
}

//-------------------------------------------------------------------
//This function shows the pop-up bubble with error for element with class mouseoverClass
//Parameters:
//		mouseoverClass is the class name of the highlighted element
//-------------------------------------------------------------------

function showBubble(mouseoverClass, errorContent) {
	var highlightedElem = jQuery("."+mouseoverClass);        
	var position = highlightedElem.offset();
	if(position != null){
        var tPosX = (position.left - 100) + 'px';
        var tPosY = (position.top - 80)  + 'px';
        //Added random number for error filed in order to not to violate the unique id standards			
		var number = 1 + Math.floor(Math.random() * 600);
        jQuery(highlightedElem).before('<div id=\"bubbleID_'+number+ '\" style="top:' + tPosY + '; left:' + tPosX + '; position: absolute; display: inline; border: 2px; width: 300px; height: auto; background-color: pink;padding-top:10px;padding-bottom:10px; padding-right:10px;padding-left:10px;">'+ errorContent + '<input type=hidden id=\"ERROR_HIDDEN_FIELD_'+number+ '\" value=\"ROW\"></div>');
	}
}

/** End Pop-up Bubble in case of field's inside table component - Investec CR86 **/  
function sendAlert() {
	var fgName = document.getElementsByName("FORMSGROUP_ID__")[0].value;
	sendAlert(fgName);
}

//This method will be called directly for downloads in grouplets
function sendAlert(fgName) {
	
	if (!fgName){
	
	    fgName = document.getElementsByName("FORMSGROUP_ID__")[0].value;
	
	    }
	var selected = document.getElementById(fgName + ".OUTFORMAT").value;
	if (selected == 1 || selected == 2 || selected == 8 || selected == 11) {
		var msg = getMessage("SaveAndOpen");
		msg = msg + " \n";
		msg = msg + getMessage("LogOutIfOpened");
		alert(msg);
	}
}

function enableCntrlDetails(){
var fgName=document.getElementById("FORMSGROUP_ID__").value;var select=document.getElementById(fgName+".CONTROL").value;
if(select!="CBO"&&select!="LKP"){
		document.getElementById(fgName+".CONTROL_DETAILS").value="";
		document.getElementById(fgName+".CONTROL_DETAILS").disabled=true;
		document.getElementById(fgName+".ADDITIONAL_CONTROL_DETAILS").value="";
	}
else{
		document.getElementById(fgName+".CONTROL_DETAILS").disabled=false;
		document.getElementById(fgName+".ADDITIONAL_CONTROL_DETAILS").value="";
		document.ReportsDesignFG.__EVENT_ID__.disabled=false;
		document.ReportsDesignFG.__EVENT_ID__.value="LOAD_CONTROL_DETAILS";
		document.ReportsDesignFG.submit();
	}
}

function getAdditionalControlDetails()
{
	document.ReportsDesignFG.__EVENT_ID__.disabled=false;
	document.ReportsDesignFG.__EVENT_ID__.value="LOAD_ADDITIONAL_CONTROL_DETAILS";
	document.ReportsDesignFG.submit();
}

function enableReportName()
{
	
	var fgName=document.getElementById("FORMSGROUP_ID__").value;	
	var manualJrxml=document.getElementById(fgName+".MANUAL_JRXML");
	var manualJsp=document.getElementById(fgName+".MANUAL_JSP");	
	if(manualJrxml.checked || manualJsp.checked)
	{
		document.getElementById(fgName+".REPORT_NAME").disabled=false;
	}
	else
	{
		document.getElementById(fgName+".REPORT_NAME").value="";
		document.getElementById(fgName+".REPORT_NAME").disabled=true;
	}
}

function getControlDetails()
{
var controlDesc = new Array();
var controlValue = new Array();

    var fgName=document.getElementById("FORMSGROUP_ID__").value;	
	var selCri = document.getElementById(fgName+".DISPLAY_SECTION").value;    
	var select = document.getElementById(fgName+".CONTROL");
	if(select.options.length > 1 )
	 {
		for(var i = 0;i<select.options.length;i++)
		 {
			controlDesc[i] = select.options[i].text;
			controlValue[i] = select.options[i].value;
		 }
	 }
	 
	if(selCri=="O" || selCri=="B")
	{  
		
		select.options.length=1;
		select.options[0] = new Option('CheckBox', 'CHK');
		document.getElementById(fgName+".CONTROL_DETAILS").value="";
		document.getElementById(fgName+".CONTROL_DETAILS").disabled=true;
		document.getElementById(fgName+".ADDITIONAL_CONTROL_DETAILS").value="";
		
   	}
   else
   {
        select.options.length=controlDesc.length;		
        document.getElementById(fgName+".CONTROL_DETAILS").disabled=false;
        document.getElementById(fgName+".ADDITIONAL_CONTROL_DETAILS").value="";
		for(var i = 0;i<controlDesc.length;i++)
		{
			 select.options[i]=new Option(controlDesc[i],controlValue[i]);
		}
   }


}
function getPaymentDetails(cpType){
    var fgName=document.getElementsByName("FORMSGROUP_ID__")[0].value;
    var selectedBnfValue=document.getElementById(fgName+".DESTINATION_DETAILS_STRING_"+cpType).value;
    var bnfValuesList= selectedBnfValue.split ('/');
    var paymentDetailsEntity=bnfValuesList[5];
    if(paymentDetailsEntity==undefined)
    {    
    	document.getElementById(fgName+".BENEFICIARY_REFERENCE").value="";
    }
    else
    {
      var paymentDetailsKeyValArray=paymentDetailsEntity.split ( ':' );
      var paymentDetails=paymentDetailsKeyValArray[1];
        document.getElementById(fgName+".BENEFICIARY_REFERENCE").value=paymentDetails;
    }
}
function enableCntrlDetails()
{
	var fgName=document.getElementById("FORMSGROUP_ID__").value;
 	var select = document.getElementById(fgName+".CONTROL").value; 	 
 	if(select !="CBO" &&  select != "LKP" )
     {
     	   document.getElementById(fgName+".CONTROL_DETAILS").value=""; 
        document.getElementById(fgName+".CONTROL_DETAILS").disabled=true;
     	   document.getElementById(fgName+".ADDITIONAL_CONTROL_DETAILS").value="";
     }   
 	else
     {
	   document.getElementById(fgName+".CONTROL_DETAILS").disabled=false;       	       
		   document.getElementById(fgName+".ADDITIONAL_CONTROL_DETAILS").value="";      	       
	   document.ReportsDesignFG.__EVENT_ID__.disabled=false;
       document.ReportsDesignFG.__EVENT_ID__.value="LOAD_CONTROL_DETAILS";       
       document.ReportsDesignFG.submit();       
     }  
}
function getAdditionalControlDetails()
{          
       document.ReportsDesignFG.__EVENT_ID__.disabled=false;
       document.ReportsDesignFG.__EVENT_ID__.value="LOAD_ADDITIONAL_CONTROL_DETAILS";	
	   document.ReportsDesignFG.submit();
}

/**
 * Utility method to determine if a grouplet has invoked the function
 * */
function isGrouplet(id){
	//TODO Move hardcoded value to a shared constant
	if(id.indexOf(":")==-1){
		return false;
	}else return true;
}

/*
 * This method will load an rich text editor
 * id - The id attribute value of the text area component
 * imgPath - The images folder path
 */
function loadRichTextEditor(id,imgPath){
	
	var oHeight = feba.domManipulator.getElementById(id).css("height");
	var oWidth = feba.domManipulator.getElementById(id).css("width");
	var textArea = feba.domManipulator.getElementById(id);
	var editor = textArea.cleditor({height:oHeight,width:oWidth,imagePath:imgPath,
		controls : "bold italic underline | font size " +
        "style | color highlight | bullets numbering | undo redo | " +
        "rule link unlink | cut copy paste pastetext |" });
	feba.domManipulator.addData(textArea,'editor',editor[0]);

}

/**
 * this method is used to reset the rich text editor frame
 * @param textAreaId
 * @param groupletId
 */
function resetRichTextEditor(textAreaId,groupletId){
	feba.domManipulator.documentReady(function(){
	
	var resetButtons = getResetButtons(groupletId);
	var textArea = feba.domManipulator.getElementById(textAreaId);
	feba.domManipulator.click(resetButtons,function(){ 
		feba.domManipulator.val(textArea,'');
		var editor = feba.domManipulator.getData(textArea,'editor');
		editor.updateFrame();
	});
	});
}

//Code change for FNEB10.3_CR74 - Session time out starts here
function sessionTimer(cssURL1, cssURL2,usertype) {
	
	var sessionExpireTime=0;//stores the time to show the Session alert popup
	var sessionWindow=null;//stores the handle to session alert popup
	var sessionHdrTimerID=null;//stores the timer identifier for Header Text Session timeout value
	var sessionPopupTimerID=null;//Stores the timer identifier for Session alert popup
	
	var sessionExpiredMsg = getMessage("SessionExpiredMsg");
	var reloginMsg = getMessage("ReloginMsg");
	var sessionExpiringMsg = getMessage("SessionExpiringMsg");
	var secMsg = getMessage("Seconds");
	var continuesessionMsg = getMessage("ContinueSessionMsg");
	var expiringMsg = getMessage("SessionTimeoutMsg");
	var sessionAlertMsg = getMessage("SessionAlert");
	var goToLoginPageMsg = getMessage("GoToLoginPage");

	/*
	 * This method will give time in hrs : minutes format
	 * @param seconds, input time in seconds 
	 */
	this.getSecondsLeft = function(seconds) {
		var hours=0;
		var minutes=0;
		//Calculate the hours left to show it in page header 
		if (seconds > 3600) {
		
			hours =parseInt(seconds/3600);
		}
		//Calculate the minutes left to show it in page header
		if (seconds > 60 ) {
			minutes = parseInt((seconds-hours*3600)/60);
		}
		//Calculate the seconds left to show it in page header
		seconds = seconds - (hours*3600) - (minutes*60);
		return hours + " hrs: " +minutes + " mins";
	}

	/*
	 * This method will start timer for page header and session alert popup
	 */
	this.start = function() {
		var timerVal=Number(document.getElementById("sessionAlertTime").value);
		var sessionTimeout=Number(document.getElementById("sessionTimeout").value);
		//Check for invalid session alert configuration details
		if (timerVal <=0 || timerVal>=sessionTimeout) {
			//session timeout and alert interval variables are wrongly configuration
			return;
		}
		sessionExpireTime=sessionTimeout-timerVal;
		
		var linkNode;
		
		//Dynamically insert an text to show the session timeout value
		var oNode=document.createElement("SPAN");
		oNode.innerHTML="<span class='simpletext' style='color:red;' id='expiryMsg'>"+expiringMsg+"<label id='sessionExpiryTime'>" + this.getSecondsLeft(sessionTimeout) + "</label></span><br />";
		if(usertype ==4){
		linkNode = document.getElementById('PREVENT_SESSION_TIMEOUT__');	
		}else{
		linkNode = document.getElementById('lastLoginMessage_1');	}
		var parent = linkNode.parentNode;
		parent.insertBefore(oNode, linkNode);
		
		//start the timer for page header timeout text
		sessionHdrTimerID=setInterval("this.updateHeaderTime()",60000);
		
		//start the timer for Session alert timeout text
		sessionPopupTimerID=setInterval("this.showSessionExpiredPopup()",1000);
	}
	
	/* 
	 * This method updates the page header countdown timer for session timeout value
	 */
	this.updateHeaderTime = function() {
		var sec=Number(document.getElementById("sessionTimeout").value);
	
		//Decrement by 60, since the timer is configured for every 60 seconds
		sec=sec-60;
	
		document.getElementById("sessionExpiryTime").childNodes[0].nodeValue = this.getSecondsLeft(sec);
	
		//reset the session timeout value 
		document.getElementById("sessionTimeout").value=sec;
	
		//Show the Session alert popup when the session expires. 
		if (sec != 0 && sec < 60) {
			clearInterval(sessionHdrTimerID);
			mSec= sec*1000;
			sessionHdrTimerID=setInterval("this.showExpiredPopup()",mSec);
		}
		if (sec == 0) {
			//Call the showExpiredPopup method to inform user that the sesion got expired.
			this.showExpiredPopup();
		}
	}
	
	/*
	 * This method will show a session expired popup with login button (Displayed after session expires)
	 */
	this.showExpiredPopup = function() {
		//Clear the timer for page header
		clearInterval(sessionHdrTimerID);
		if (sessionWindow!= null && sessionWindow.closed) {
			//Popup window is closed before session expired message is displayed. So, opening it again.

			//Create the Session alert popup
			var doc=this.createSessionPopupDoc();

			//Hide irrevalent sections
			var str = "<script>";
			str += "document.getElementById('rowID1').style.display='';";
			str += "document.getElementById('rowID2').style.display='none';";
			str += "document.getElementById('rowID3').style.display='none';";
			str += "window.onunload = function () { document.getElementById('gotoLoginImg').click(); } ";
			str += "</script>";

			//Write to the session popup window
			doc.write(str);
			doc.close();
		}
	}
	
	/* 
	 * This method shows a session expired popup
	 * The popup will be shown only when the configured alert interval is reached.
	 */
	this.showSessionExpiredPopup = function() {
		sessionExpireTime--;
	
		//Show the Session popup only when the timer reaches 0
		if (sessionExpireTime != 0) {
			return;
		}
		
		clearInterval(sessionPopupTimerID);
		//Create the Session alert popup
		var doc= this.createSessionPopupDoc();
		//Hide irrevalent sections and start countdown timer
		var str = "<script>";
		str += "function updateTime() {";
		str += "	if (timerVal == 0) {";
		str += "		clearInterval(timerID); ";
		str += "		document.getElementById('rowID1').style.display='';";
		str += "		document.getElementById('rowID2').style.display='none';";
		str += "		document.getElementById('rowID3').style.display='none';";
		str += "		window.onunload = function () { document.getElementById('gotoLoginImg').click(); }; ";
		str += "		window.focus();";
		str += "	} else {";
		str += "		timerVal--;";
		str += "		document.getElementById('secLabel').childNodes[0].nodeValue=timerVal;";
		str += "	}";
		str += "}";
		str += "var timerVal=window.opener.document.getElementById('sessionAlertTime').value;";
		//str += "timerVal=(timerVal)*60;";
		str += "document.getElementById('secLabel').childNodes[0].nodeValue=timerVal;";
		str += "var timerID=setInterval('updateTime()',1000);";
		str += "</script>";
	
		//Write the newly created script to the Session popup window
		doc.write(str);
		doc.close();
	}
	
	/* 
	 * This method is used to show a session alert popup 
	 * using dynamically created HTML content 
	 */
	this.createSessionPopupDoc = function() {
		//Open an empty popup for showing session alert
	    sessionWindow =window.open("","_blank","width=420,cellpadding=0,cellspacing=0,height=220,status=no,location=0,resizable=no,left=500,top=265,dependent=1,alwaysRaised=1,title=0");
	
		var doc=sessionWindow.document;
		var sessionImgPath = document.getElementById('sessionImgPath').value;
		var sessionLoginURL = document.getElementById('sessionLoginURL').value ;
	
		
		var str = "<html>";
		str += "<head>";
		str += "<title>Session Alert</title>";
		str += "<link href='"+cssURL1+"' rel='stylesheet' type='text/css'>"; 
		str += "<link href='"+cssURL2+"' rel='stylesheet' type='text/css'>"; 
		str += "</head>";
		str += "<body>";
		str += "<div id='sessionPopup'>	";
		str += "<div id='sessionPopupTitle'>";		
		str += "	<B>"+ sessionAlertMsg +"</B>";
		str += "</div>";
		str += "<div id='sessAlertTable'>";
		str += "<table id='sessionTable' width='100%'>";
		str += "<tr id='rowID1' style='display:none' align='center'>";
		str += "<td colspan='2' align='center'>";
		str += "<table width='100%'>";
		str += "<tr align='left'>";
		str += "<td align='left' colspan='2' class='sessionExpiredRow'>"+ sessionExpiredMsg +"</td>";
		str += "</tr>";
		str += "<tr align='left'>";
		str += "<td align='left' colspan='2' class='reloginMsgRow'>"+ reloginMsg +"<br /><br/></td>";
		str += "</tr>";
		str += "<tr align='center'>";
		str += "<td colspan='2'>";
		str += "<br/><br/><img src='"+ sessionImgPath +"' alt='"+ goToLoginPageMsg +"' title='"+ goToLoginPageMsg +"' id='gotoLoginImg' border='0' onclick='window.close();window.opener.goToLoginPage(\""+ sessionLoginURL +"\");' />";
		str += "</td>";
		str += "</tr>";
		str += "</table>";
		str += "</td>";
		str += "</tr>";
		str += "<tr id='rowID2' align='center'>";
		str += "<td colspan='2'>";
		str += "<table width='100%'>";
		str += "<tr align='left'><td align='left' class='sessionExpiredRow'>"+ sessionExpiringMsg +"<label id='secLabel'>0</label>"+ secMsg +"</td></tr>"; 
		str += "<tr align='left'><td align='left' class='reloginMsgRow'>"+ continuesessionMsg +"</td></tr>";
		str += "</table>";
		str += "</td>";
		str += "</tr>";
		str += "<tr id='rowID3' align='right'>";
		str += "<td><br /><br /><input type='button' id='continue_session_btn' value='Continue Session' onclick='window.close();window.opener.resetSession();' class='btn'></td>";
		str += "<td align='center'><br /><br /><input id='close_btn' class='close_btn' type='button' value='Close' onclick='window.close();' class='btn'></td>";
		str += "</tr>";
		str += "</table>";
		str += "</div>";
		str += "</div>";	
		str += "</body>";
		str += "</html>";
		doc.write(str);
		return doc;
	}

	start();
}

/*
 * This method will refresh the current page with the given url.
 * This method will be called from Session alert popup
 * @param url, the URL to be loaded
 */
function goToLoginPage(url) {
	//Refreshes the main page with the login page
	window.open(url,'_self');
}

/*
 * This method will refresh the session by using prevent session timeout link
 * in the page header
 */
function resetSession(){
	//Click on the Prevent Session Timeout button in the page header to reset the session value.
	document.getElementById("PREVENT_SESSION_TIMEOUT__").click();
}
//Code change for FNEB10.3_CR74 - Session time out ends here
//-------------------------------------------------------------------


/**
	* This method is used to get the reset buttons present on a particular view
	* @param groupletId
	* Added for ticket id 546724.
*/
function getResetButtons(groupletId){
	if(groupletId=='null'){
		groupletId = '';
	}
	var resetButtons = feba.domManipulator.find(feba.domManipulator.getElement(document),':input[type*="Reset"][id*="'+groupletId+'"]');
	if(resetButtons.length==0){
		resetButtons = feba.domManipulator.find(feba.domManipulator.getElement(document),':input[type*="reset"][id*="'+groupletId+'"]');
	}
	return resetButtons;
}
	
function getFunctionCodeDetails()
{          
       document.AuthSchemeMaintenanceFG.__EVENT_ID__.disabled=false;
       document.AuthSchemeMaintenanceFG.__EVENT_ID__.value="PREVENT_SESSION_TIMEOUT__";	
       document.AuthSchemeMaintenanceFG.submit();
}
function getFunctCodeDetailsInqFG()
{          
       document.InquiryFWFG.__EVENT_ID__.disabled=false;
       document.InquiryFWFG.__EVENT_ID__.value="PREVENT_SESSION_TIMEOUT__";	
       document.InquiryFWFG.submit();
}

//Function to get the specific elements on a page or Grouplet
function getSpecifiedElements(groupletId,type,isPortal){
		var totalElements = new Array();
           if(!groupletId || isPortal){
           		var totalPageElements = feba.domManipulator.getElement(type);
	    		for(var i=0;i<totalPageElements.length;i++) { 
    				if((totalPageElements[i].id).indexOf(Constants.GROUPLET_ELEMENT_SEPERATOR)==-1 || isPortal) { 
      					totalElements.push(totalPageElements[i]) ; 
    				} 
  				}	                       
           } else{
            	totalElements = feba.domManipulator.find(feba.domManipulator.getElementById(groupletId),type);
           }
          return totalElements;
          
}
//Function to check whether the groupletId is not null and doesn't contain grouplet Seperator
function isGroupletId(elementId,groupletId){
	if(groupletId!="null"&&groupletId&&elementId.indexOf(groupletId+Constants.GROUPLET_ELEMENT_SEPERATOR)==-1){
		return true;
	}
	return false;
}

//-------------------------------------------------------------------
//This function returns the id of label associated with an element.
//Parameters:
//			id: the id of the element whose label has to be found
//Returns:
//			id of the label associated with the element
//-------------------------------------------------------------------
function getLabelIDByFieldId(Id){	
	var lableCtrlIds="";
	var outLabel="";
	lableCtrlIds = document.getElementsByTagName('label');
	var n = lableCtrlIds.length;
	for(i = 0; i < n ; i++){
			var jsVarForControlId = lableCtrlIds[i].htmlFor;
			if(jsVarForControlId != null && jsVarForControlId == Id){
				outLabel = lableCtrlIds[i].id;
				break;
			}
		}	
	return outLabel;
}
//-------------------------------------------------------------------
//This function gets the closest parent with the given tag name.
//Parameters:
//			obj: the object whose parent needs to be found
//			tag: the type of parent which needs to be found
//Returns:
//			nearest parent of the obj of type tag
//-------------------------------------------------------------------

function getParentByTagName(obj, tag)

{
	try {
		//get the parent node
		var obj_parent = obj.parentNode;
		//check if the parent node is of type tag
		// if not, find the parent of parent node
		//repeat until the required parent is found
		while (obj_parent.tagName != tag) {

			obj_parent = obj_parent.parentNode;

		}
		// return the parent of type tag
		return obj_parent;
	} catch (err) {
		//return null if parent of type tag is not found
	return null;
	}
}
//-------------------------------------------------------------------
//This function checks if there is error in any child element of p 
//and returns an error flag 
//Parameters:
//		childElements of the parent P element, id of the element, regExp contains the starting static id chars of hidden fields
//		ERROR_ROW_ in case of field.java - Business Exception and  ERROR_HIDDEN_ROW_ in case of dispalyError - type system
//-------------------------------------------------------------------
function isAnyChildInError(childElements, id, regExp){
	var errorFlag = false;
		
	for ( var i = 0; i < childElements.length; i++) {
		// if the id matches to the hidden field defined in Field.java/displayError method, set the error flag
		if (childElements[i].id.match(regExp)) {
			if (childElements[i].value == 'ROW') {			
				errorFlag = true;				
			}
		}
	}
	return errorFlag;
}
//-------------------------------------------------------------------
//This function restores the style, after a typesystem error has
// been corrected by the user
//Parameters:
//		id of the element, whose parent row's or label style has to be restored
//-------------------------------------------------------------------
function restoreStyle(id) {
	// if js config is row, reset the style
	if(FEBAJSConfig.TYPESYSTEM_ERR_HIGHLIGHT === "ROW"){
		
		//get parent of element which is of type 'P'
		var parentP = getParentByTagName(document.getElementById(id), 'P');
		
		//Checks for any business exception fields
		var childElements = jQuery(parentP).find('input');
		var busExErrorFlag = false;
		var regExp = /^ERROR_ROW_/;
		busExErrorFlag = isAnyChildInError(childElements, id, regExp);

		//Checks for any type system error fields
		var typeSysErrorFlag = false;
		regExp = /^ERROR_HIDDEN_ROW_/;
		typeSysErrorFlag = isAnyChildInError(childElements, id, regExp);
		
		// if there is no business exception and type system exception in the child elements of parentP element, then only remove
		// class ERROR_ROW_BG from the parentP element 
		if((busExErrorFlag == false) && (typeSysErrorFlag == false)){
			// if the parent contains class ERROR_ROW_BG remove it
			if (hasClass(parentP, "ERROR_ROW_BG")) {
				var reg = new RegExp('(\\s|^)' + "ERROR_ROW_BG" + '(\\s|$)');
				parentP.className = parentP.className.replace(reg, ' ');
			}		
		}
	}
	else{
		// if JS Config is label reset the style
		if(FEBAJSConfig.TYPESYSTEM_ERR_HIGHLIGHT === "LABEL"){
			var label=document.getElementById(getLabelIDByFieldId(id));
			if (hasClass(label, "error_highlight")) {
				var reg = new RegExp('(\\s|^)' + "error_highlight" + '(\\s|$)');
				label.className = label.className.replace(reg, ' ');
			}
			
		}
	}
}
//-------------------------------------------------------------------
//This function checks if an element contains a class.
//Parameters:
//			element
//			className
//Returns: 
//		true, if the element contains the class
//		false,if the element doesn't contains the class
//-------------------------------------------------------------------

 function hasClass(ele,cls) { 
	 //check if the element ele contains the class cls
	 if(ele != null){
	 	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')); 
	 }
}  
//-------------------------------------------------------------------
//This function clears error Message after a typesystem error has
//been corrected by the user
//Parameters: id of the element whose associated error message needs 
//to be cleared
//-------------------------------------------------------------------
function clearError(id){
	// clear the error message
	// to fix an issue in IE7, removed errorSpan. 
	//Even if we empty the error span in IE7, still it is visible 
	var errorSpan=document.getElementById("ERROR_ROW_"+id);
	if(errorSpan!=null){
		jQuery(errorSpan).remove();
	}
	
	/*Start Added for Investec CR86*/
	// Remove error highlighting in case of field inside a table component
	
	var elem = document.getElementById(id);
	var tableElem = jQuery(elem).closest('table');
	if(tableElem.html() != null){
		var elems = jQuery(elem).parentsUntil("td");
		var nLevelSpan = elems[elems.length-1];	
		if(jQuery(nLevelSpan).hasClass('ERROR_FIELD_BORDER_TYPESYS')){
			jQuery(nLevelSpan).removeClass('ERROR_FIELD_BORDER_TYPESYS');
 			hideBubble();
		}
	}
	/*End Added for Investec CR86*/
	//remove the error style from parent row
	restoreStyle(id);
}

/**Start Investec CR104 for Error Highlighting**/
//This function changes the border color of a field, if it had a Business exception earlier and now it has been corrected  
function changeFieldBorderColor(elem){
	var tableElem = jQuery(elem).closest('table');
	if(tableElem.html() != null){
		var elems = jQuery(elem).parentsUntil("td");
		var nLevelSpan = elems[elems.length-1];	
		if(jQuery(nLevelSpan).hasClass('ERROR_FIELD_BORDER')){
			jQuery(nLevelSpan).removeClass('ERROR_FIELD_BORDER');
			jQuery(nLevelSpan).addClass('CORRECTED_ERROR_FIELD_BORDER');
		}
	}
}
/**End Investec CR104 for Error Highlighting**/ 
//-------------------------------------------------------------------
//Added for Investec CR113
//This function displays typesystem error messages to the user
//depending upon configurations set in FEBAJSConfiguration.js
//Parameters:
//			error: error message to be displayed
//			id: id of the element associated with the error
//-------------------------------------------------------------------
function displayError(error,id){
	// check configuration in FEBAJSConfiguration.js
	if(FEBAJSConfig.TYPESYSTEM_ERR_DISPLAY === "POPUP"){
		// show a popup with error message
		alert(error);
	}
	else{
		if(FEBAJSConfig.TYPESYSTEM_ERR_DISPLAY === "FIELD"){
			//create a span element if not already present
			var errorSpan = document.getElementById("ERROR_ROW_"+id);
			if(errorSpan==null){
				errorSpan = document.createElement('span');			
			}
			else{
				errorSpan.innerHTML="";			
			}


			var elem = document.getElementById(id);
			/*Start Added for Investec CR86*/
			//If the field in error is inside a table, then 
			//highlight the border of field's outer span
			//and add pop-up bubble mouse events to it   
			var tableElem = jQuery(elem).closest('table');
			var tableElemStyle = tableElem.attr('class');
			//to check if the table belongs to the portal theme
			//then we can ignore that particular table
			if(tableElemStyle=='layoutColumn'){
				tableElem=null;
			}
			if(tableElem!=null && tableElem.html() != null){
				var elems = jQuery(elem).parentsUntil("td");	
				var nLevelSpan = elems[elems.length-1];	
				if(!jQuery(nLevelSpan).hasClass('ERROR_FIELD_BORDER_TYPESYS')){
					/*Start Investec CR104 for Error Highlighting*/
					//If this field was corrected after business exception, remove that class(CORRECTED_ERROR_FIELD_BORDER) now
					if(jQuery(nLevelSpan).hasClass('CORRECTED_ERROR_FIELD_BORDER')){
						jQuery(nLevelSpan).removeClass('CORRECTED_ERROR_FIELD_BORDER');
					}
					/*End Investec CR104 for Error Highlighting*/
					jQuery(nLevelSpan).addClass("ERROR_FIELD_BORDER_TYPESYS");
					showBubble("ERROR_FIELD_BORDER_TYPESYS", error);
				}
			}
			/*End Added for Investec CR86*/
			else{
				var elems = jQuery(elem).parentsUntil("p");
				var nLevelSpan = elems[elems.length-1];
				
				/* Added by Vivek Niraimathi for javascript error messages with parent as div*/
				if(nLevelSpan.id == null || nLevelSpan.id == ""){
					var elems = jQuery(elem).parentsUntil("div");
					var nLevelSpan = elems[elems.length-1];
				}
				/* Added by Vivek Niraimathi for javascript error messages with parent as div*/	
				
				// add error message to the span
				errorSpan.id="ERR_MSG_SPAN_"+id;
				errorSpan.className="simpletext";
				jQuery(errorSpan).html(error);
			
				//Forms the span for row and append it as the 
				//last children to parent span(To work in case of composite components)  
				var parentErrorSpan = document.createElement('span');
				parentErrorSpan.id="ERROR_ROW_"+id;
				parentErrorSpan.className="ERROR_ROW_SPAN";
				jQuery(parentErrorSpan).html(errorSpan);
			
				//Added random number for error filed in order to not to violate the unique id standards			
				var number = 1 + Math.floor(Math.random() * 600);
				var hiddenField = "<input type=hidden id=\"ERROR_HIDDEN_ROW_"+number+"\" value=\"ROW\">"; 
				jQuery(parentErrorSpan).append(hiddenField);
				// add span to the row
				jQuery(nLevelSpan).append(parentErrorSpan);
			}
		}
	}
	// highlight the error field
	highlightErrorField(id);
}
//-------------------------------------------------------------------
//This function highlights error label or row depending on 
//configuration set in FEBAJSConfiguration.js
//Parameters: id: id of the element associated with the error
//-------------------------------------------------------------------
function highlightErrorField(id){
	if(FEBAJSConfig.TYPESYSTEM_ERR_HIGHLIGHT === "LABEL"){
	var label=document.getElementById(getLabelIDByFieldId(id));
	//if label is to be highlighted, add the class to label
	label.className += " error_highlight";
	}
	else{
		//if row is to be highlighted, add the class to row
		if(FEBAJSConfig.TYPESYSTEM_ERR_HIGHLIGHT === "ROW"){
			var parent=getParentByTagName(document.getElementById(id), 'P');
			if((parent !=null ) && (!hasClass(parent,"ERROR_ROW_BG"))){
				parent.className += " ERROR_ROW_BG";
			}
			
		}
	}
}
//-------------------------------------------------------------------
//This function highlights the rows containing hidden field with id
//ERROR_ROW_[RANDOM NUMBER]
//This field will be added by Field.java in case the field contains an error
//-------------------------------------------------------------------
function highLightErrorRow() {
	// get all the elements of the document
	var element = document.getElementsByTagName('input');

	// Removes the error from current location and insert into a proper location
	// In case of composite component, the error should come after all its elements
	var errorElems = jQuery('.ERROR_ROW_HIGHLIGHT');
	var totalErrorElems = errorElems.length;

	for(var index = 0; index < totalErrorElems; index++){	 
		var elems = jQuery(errorElems[index]).parentsUntil("p");	
		var nLevelSpan = elems[elems.length-1];	
		// If the element's parent is span then only adjust the error message's location
		if (jQuery(nLevelSpan).is("span") ) {
			//Get the DOM element of error row 
			var highlightedRow = errorElems[index];
			//Remove the element highlightedRow from the present location and append it as the last child 
			//of its parent
			var htmlBackup = "<span id=\""+ highlightedRow.id + "\" class=\"ERROR_ROW_HIGHLIGHT"+ "\" >" + jQuery(highlightedRow).html()+ "</span>";
			jQuery(highlightedRow).remove();
			jQuery(nLevelSpan).append(htmlBackup);
		}
	}
	 
	for ( var i = 0; i < element.length; i++) {
		// if the id matches to the hidden field defined in Field.java, highlight the parent row
		if (element[i].id.match(/^ERROR_ROW_/)) {
			if (element[i].value == 'ROW') {
				var parentP=getParentByTagName(element[i], 'P');
				if((parentP != null) && (!hasClass(parentP,"ERROR_ROW_BG"))){
					parentP.className += " ERROR_ROW_BG";
				}				
			}

		}
	}

}
/*Start Added for Investec CR86*/
//-------------------------------------------------------------------
//This function highlights the fields containing hidden field with id
//ERROR_FIELD_[RANDOM NUMBER]
//This field will be added by Field.java for listing fields in case 
//the field contains an error
//-------------------------------------------------------------------
function highLightErrorField() {
      // get all the elements of the document
      var element = document.getElementsByTagName('input');
      
      for ( var i = 0; i < element.length; i++) {
            if (element[i].id.match(/^ERROR_FIELD_/)) {
                  
                  var previous = jQuery(element[i]).prev();
                  var prevElement = previous[previous.length-1];              
                  prevElement.className += " ERROR_FIELD_BORDER"; 
                  
            }
      }
}
/*End Added for Investec CR86*/


/* Fix for ENY Security concern:start */
function saveAlert(){
	var msg = getMessage("SaveAndOpen");
		msg = msg + " \n";
		msg = msg + getMessage("LogOutIfOpened");
		alert(msg);
}

/* Fix for ENY Security concern:End */
/* function for confirmation for Restore Dashboard button*/
function restore_confirm(fieldId){
	
	var r=confirm("Are you sure you want to Reset?");
	if (r==true)
	{
		document.getElementById(fieldId).value="1";
		
	}
	else
	{
		document.getElementById(fieldId).value="0";
	}
}
/* Added for 1106 Average Quarterly & monthly balance :: START */
function defaultMonthSelection(){
	var elementId = this.options.target.split("=")[0],
	element = LIB.__GET_DOM__(elementId),
	size = element.length;
	
	//Current Year selected & current month is not Dec
	if( (size != 12) && (size < 12) ){
		element.selectedIndex = size - 1;
	}
	//Current Year selected & current month is Dec
	else if( size==13 ){
		element.length = size -1;
		element.selectedIndex = size - 2;
	}
}

function defaultQuarterSelection(){

	var elementId = this.options.target.split("=")[0],
	element = LIB.__GET_DOM__(elementId),
	size = element.length;
	
	//Current Year selected & current month is not in last quarter
	if((size != 4) && (size < 4)){
		element.selectedIndex = size - 1;
	}
	//Current Year selected & current month is in last quarter
	else if( size==5 ){
		element.length = size -1;
		element.selectedIndex = size - 2;
	}
}
/* Added for 1106 Average Quarterly & monthly balance :: END */
function checkSubmit(e)
{
      //Check for IE. IE does not understand event
      if (!e){
            e= window.event;
      }
     
      if(e.keyCode == 13)
      {
            var loadButton=feba.domManipulator.getElementEndingWith("GOTO_PAGE__");
            if( jQuery.browser.msie) {
     	
     		    //Check for IE8. IE8 does not support Prevent Default
				if(e.preventDefault) {
  					e.preventDefault();
				}
				else{
   					e.returnValue = false;
				}
            }      
            feba.domManipulator.trigger(loadButton,"click");    
      }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fillInput") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            let activeTabId = tabs[0].id;
            
            chrome.scripting.executeScript({
                
                target: { tabId: activeTabId },
                function: (data) => {
                    function convertTo12Hour(time) {
                        if (!/^\d{1,2}:\d{2}$/.test(time)) {
                            return "Invalid time format"; // Basic validation
                        }
                    
                        let [hours, minutes] = time.split(':').map(Number);
                        
                        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                            return "Invalid time"; // Ensuring valid hour and minute values
                        }
                    
                        let period = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12 || 12; // Convert hours to 12-hour format (0 should be 12)
                    
                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
                    }
                    let items = ['gdob','confirmdob','gtob', 'FIPfirstname','MIPfirstname','FIPmiddlename','MIPmiddlename','FIPlastname','MIPlastname','CAPPstate','CAPPdistrict','CAPPsubdistrict','BDPAadharflag','FIDAadhar','MIDAadhar','FIPmobile','MIPmobile']
                    let mapping = ['BirthDate','BirthDate','BirthTime','Husband','Name','Husband','Name','Husband','Name','state','district','subdistrice','Aadharflag','HusbandAadhar','IdProof','Mobile','Mobile']
                    for(let i = 0; i < items.length; i++) {
                        let queryString = 'input[formcontrolname="'+items[i]+'"]';
                        let inputField = document.querySelector(queryString);
                        if (inputField) {
                            if(i == 0 || i == 1) {
                                inputField.value = new Date(JSON.parse(data).bdata[mapping[i]]).toLocaleDateString()
                            } else if (i == 2) {
                                inputField.value = convertTo12Hour(JSON.parse(data).bdata[mapping[i]]); 
                            } else if ( i == 3 || i == 4) {
                                let valueArray = JSON.parse(data).bdata[mapping[i]].split(' ');
                                if(valueArray.length > 0) {
                                    inputField.value = valueArray[0]
                                }
                            } else if(i == 5 || i == 6) {
                                let valueArray = JSON.parse(data).bdata[mapping[i]].split(' ');
                                if(valueArray.length == 3) {
                                    inputField.value = valueArray[1]
                                }
                            } else if(i == 7 || i == 8) {
                                let valueArray = JSON.parse(data).bdata[mapping[i]].split(' ');
                                if(valueArray.length == 2) {
                                    inputField.value = valueArray[1]
                                } else if(valueArray.length == 3) {
                                    inputField.value = valueArray[2]
                                } else {
                                    inputField.value = valueArray.toString();
                                }
                            } else if (i == 9) {
                                inputField.value = 'Madhya Pradesh / मध्य प्रदेश'
                            } else if ( i == 10 || i == 11) {
                                inputField.value = 'Damoh / दमोह'
                            } else if ( i == 12) {
                                inputField.value = 'Aadhaar'
                            } else if (i == 14) {
                                inputField.value = JSON.parse(data).patient[mapping[i]].toString()
                            } else if (i == 15 || i == 16) {
                                inputField.value = JSON.parse(data).patient[mapping[i]].toString()
                            }
                            else {
                                inputField.value = JSON.parse(data).bdata[mapping[i]]
                            }
                            

                            inputField.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                    /*
                    let queryString = 'input[formcontrolname="'+items[0]+'"]';
                    let inputField = document.querySelector(queryString);
                    if (inputField) {
                        inputField.value = new Date(JSON.parse(data).bdata.BirthDate).toLocaleDateString()
						console.log("Date is : "+  new Date(data.birthDate).toLocaleDateString())
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                        */
                },
                args: [message.data]
            });
        });
    }
});




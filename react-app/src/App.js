import Papa from 'papaparse';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// const allowedExtensions = ["csv"];


const App = () => {
    const [parsedCsvData, setParsedCsvData] = useState([]);
    // const [ownerName, setOwnerName] = useState('');

    const parseFile = file => {
        Papa.parse(file, {
            header: true,
            complete: results => {
                setParsedCsvData(results.data)
            },
        });
    }

    console.log(parsedCsvData);

    // parsedCsvData && parsedCsvData.forEach((dataPoint) => {
    //     if(dataPoint['Date / Time'].length > 0) {
    //         setOwnerName(dataPoint['Client Name'].split(',')[0])
    //     }
    // })

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length) {
            parseFile(acceptedFiles[0]);
        }
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: 'text/csv',
    });

    const date = new Date();
    const currYear = date.getFullYear();
    const currMonth = date.getMonth() + 1;
    const currMonStr = currMonth.toString().padStart(2, '0');
    const currDay = date.getDate().toString();
    const currDayStr = currDay.toString().padStart(2, '0');
    const currHour = date.getHours().toString().padStart(2, '0');
    const currMin = date.getMinutes().toString().padStart(2, '0');
    const currSec = date.getSeconds().toString().padStart(2, '0');

    const filteredCsvData = parsedCsvData.filter((ele) => ele.Address !== undefined);
    const tildes = (filteredCsvData.length * 4) + 6;

    const spaceCheck = (input) => {
        let newInput = input;
        // console.log('spaceCheck', input);
        if (input[0] === ' ') {
            newInput = input.slice(1);
        } else if (input[input.length - 1] === ' ') {
            newInput = input.slice(0, input.length - 1)
        }

        // console.log(newInput);

        return newInput.toString()
    }

    const states = {
        'ohio': 'OH',
        'california': 'CA',
        'hawaii': 'HI',
        'florida': 'FL',
        'texas': 'AK',
        'pennsylvania': 'PA',
        'new jersey': 'NJ',
        'arizona': 'AZ',
        'north carolina': 'NC',
        'tennessee': 'TN',
        'massachusetts': 'MA',
    }

    const regNums = {
        'AR1166520': 'Dr. Weston Richter',
        'FR8512748': 'Dr. Andrea Richter',
        'FL118890': 'Dr. Matthew Lockhart',
        'FG0133417': 'Dr. Matthew Goss',
    }

    const licenseNums = {
        'AR1166520': '7401',
        'FR8512748': '21142',
        'FL118890': '22593',
        'FC8507646': '23469',
        'FM8466749': '23442',
        'FG0133417': '22990'
    }

    const stateCheck = (input) => {
        return states[input.toLowerCase()] ? states[input.toLowerCase()] : input.toUpperCase()
    }

    return (
        <div className="App">
            <div
                {...getRootProps({
                    className: `dropzone
              ${isDragAccept && 'dropzoneAccept'}
              ${isDragReject && 'dropzoneReject'}`,
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                )}
            </div>
            <h1>Sigs</h1>
            <ul>{filteredCsvData &&
                filteredCsvData.map((parsedData, index) => {
                    let last = parsedData['Client Name'].split(',')[0];
                    let pName = parsedData['Patient Name'] ? spaceCheck(parsedData['Patient Name']) : 'MISSING PET NAME';
                    let instructions = parsedData['Medication Instructions'];
                    let endInd;
                    if (parsedData['Dispensed'].includes('.')) {
                        endInd = parsedData['Dispensed'].indexOf('.');
                    } else {
                        endInd = parsedData['Dispensed'].length;
                    }
                    let medQty = parsedData['Dispensed'].slice(1) ? parsedData['Dispensed'].slice(1, endInd) : 'MISSING QTY';
                    return <li key={index}>{pName} {last} - Qty: {medQty} / Instructions: {instructions}</li>
                })
            }</ul>
            <table>
                <thead>
                    <tr>
                        {/* <th>Header</th> */}
                        {/* Make sure to change 'T' to 'P' when done testing */}
                        <th>TH*4.1*Transaction#***{currYear}{currMonStr}{currDayStr}*{currHour}{currMin}{currSec}*P**~~IS*8187849977*Sherman Oaks Veterinary Group**~</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCsvData &&
                        filteredCsvData.map((parsedData, index) => {
                            let first;
                            let last;
                            let firstAddressLine;
                            let secondAddressLine = '';
                            let city;
                            let state;
                            let zipCode;
                            let bDay;
                            let bMonth;
                            let bYear;
                            let pSex;
                            let pName;
                            let medNum;
                            let medYear;
                            let medMonth;
                            let medDay;
                            let productId;
                            let medQty;
                            let deaReg;

                            if (parsedData.Address && parsedData.Address) {
                                last = spaceCheck(parsedData['Client Name'].split(',')[0]);
                                first = spaceCheck(parsedData['Client Name'].split(', ')[1]);
                                let len = parsedData.Address.split(', ').length;
                                if (parsedData.Address.split(', ').length === 5) {
                                    firstAddressLine = parsedData.Address.split(', ')[0] ? spaceCheck(parsedData.Address.split(', ')[0]) : 'MISSING ADDRESS LINE';
                                    secondAddressLine = parsedData.Address.split(', ')[1] ? spaceCheck(parsedData.Address.split(', ')[1]) : 'CHECKER';
                                    city = parsedData.Address.split(', ')[len - 3] ? spaceCheck(parsedData.Address.split(', ')[len - 3]) : 'MISSING CITY';
                                    state = parsedData.Address.split(', ')[len - 2] ? stateCheck(spaceCheck(parsedData.Address.split(', ')[len - 2])) : 'MISSING STATE';
                                    zipCode = parsedData.Address.split(', ')[len - 1] ? spaceCheck(parsedData.Address.split(', ')[len - 1]) : 'MISSING ZIPCODE';
                                } else {
                                    firstAddressLine = parsedData.Address.split(', ')[0] ? spaceCheck(parsedData.Address.split(', ')[0]) : 'MISSING ADDRESS LINE';
                                    city = parsedData.Address.split(', ')[len - 3] ? spaceCheck(parsedData.Address.split(', ')[len - 3]) : 'MISSING CITY';
                                    state = parsedData.Address.split(', ')[len - 2] ? stateCheck(spaceCheck(parsedData.Address.split(', ')[len - 2])) : 'MISSING STATE';
                                    zipCode = parsedData.Address.split(', ')[len - 1] ? spaceCheck(parsedData.Address.split(', ')[len - 1]) : 'MISSING ZIPCODE';
                                }
                                // create code that identifies what to split by whether its / or - or whatever
                                bYear = parsedData['Patient D.O.B.'].split('/')[2] ? spaceCheck(parsedData['Patient D.O.B.'].split('/')[2]) : 'MISSING BIRTH YEAR';
                                bMonth = parsedData['Patient D.O.B.'].split('/')[0] ? spaceCheck(parsedData['Patient D.O.B.'].split('/')[0].padStart(2, '0')) : 'MISSING BIRTH MONTH';
                                bDay = parsedData['Patient D.O.B.'].split('/')[1] ? spaceCheck(parsedData['Patient D.O.B.'].split('/')[1].padStart(2, '0')) : 'MISSING BIRTH DAY';

                                if (parsedData['Patient D.O.B.'].split('/').length === 1) {
                                    bYear = parsedData['Patient D.O.B.'].split('-')[2] ? spaceCheck(parsedData['Patient D.O.B.'].split('-')[2]) : 'MISSING BIRTH YEAR';
                                    bMonth = parsedData['Patient D.O.B.'].split('-')[0] ? spaceCheck(parsedData['Patient D.O.B.'].split('-')[0].padStart(2, '0')) : 'MISSING BIRTH MONTH';
                                    bDay = parsedData['Patient D.O.B.'].split('-')[1] ? spaceCheck(parsedData['Patient D.O.B.'].split('-')[1].padStart(2, '0')) : 'MISSING BIRTH DAY';
                                }

                                pName = parsedData['Patient Name'] ? spaceCheck(parsedData['Patient Name']) : 'MISSING PET NAME';
                                // Mark all FM/F as F and all MN/M as M
                                if (parsedData['Patient Sex'] && (parsedData['Patient Sex'].toLowerCase() === 'fs' || parsedData['Patient Sex'].toLowerCase() === 'f')) {
                                    pSex = 'F';
                                } else if (parsedData['Patient Sex'] && (parsedData['Patient Sex'].toLowerCase() === 'mn' || parsedData['Patient Sex'].toLowerCase() === 'm')) {
                                    pSex = 'M'
                                } else pSex = 'U'
                                medNum = parsedData['Prescription No.'] ? parsedData['Prescription No.'] : 'MISSING MEDICATION #';
                                medYear = parsedData['Medication Timestamp'].split(' ')[0].split('-')[2] ? parsedData['Medication Timestamp'].split(' ')[0].split('-')[2] : 'MISSING MED DATE (YEAR)';
                                medMonth = parsedData['Medication Timestamp'].split(' ')[0].split('-')[0] ? parsedData['Medication Timestamp'].split(' ')[0].split('-')[0] : 'MISSING MED DATE (MONTH)';
                                medDay = parsedData['Medication Timestamp'].split(' ')[0].split('-')[1] ? parsedData['Medication Timestamp'].split(' ')[0].split('-')[1] : 'MISSING MED DATE (DAY)';
                                productId = parsedData['Product Identifier'] ? parsedData['Product Identifier'] : 'MISSING PRODUCT ID';
                                let endInd;
                                if (parsedData['Dispensed'].includes('.')) {
                                    endInd = parsedData['Dispensed'].indexOf('.');
                                } else {
                                    endInd = parsedData['Dispensed'].length;
                                }
                                medQty = parsedData['Dispensed'].slice(1) ? parsedData['Dispensed'].slice(1, endInd) : 'MISSING QTY';
                                deaReg = parsedData['DEA Reg No.'] ? parsedData['DEA Reg No.'] : parsedData['Prescriber DEA Number'] ? parsedData['Prescriber DEA Number'] :'MISSING DEA NUM';
                            }

                            let unit = '01';

                            if (parsedData['Product Identifier'] === '60432-455-16') unit = '02';
                            // console.log(parsedData && parsedData['Client Name']);
                            // console.log(parsedData && parsedData['Client Name'].split(',')[0]);
                            return <tr className='patientData' key={index}>
                                <td>
                                    {/* <p>TH*4.2B*Transaction#***{currYear}{currMonStr}{currDayStr}*{currHour}{currMin}{currSec}*P**~~IS*8187849977*Sherman Oaks Veterinary Group**~</p> */}
                                    <p>PHA***{deaReg}*{regNums[deaReg]}******8187849977*{licenseNums[deaReg]}***~</p>
                                    <p>PAT*******{last}*{first}****{firstAddressLine}*{secondAddressLine}*{city}*{state}*{zipCode}**{bYear}{bMonth}{bDay}*{pSex}*02***{pName}*~</p>
                                    <p>DSP*00*{medNum}*{medYear}{medMonth}{medDay}*0*{medYear}{medMonth}{medDay}*0*01*{productId.split('-').join('')}*{medQty}*<strong>DAYSUPPLY</strong>*{unit}*01*00***01*{medYear}{medMonth}{medDay}********~PRE**{deaReg}********~</p>
                                    {/* <p>TP*6*~TT*<strong>Transaction#(must match TH02)</strong>*9*~</p> */}
                                </td>
                            </tr>
                        })}
                    <tr>
                        <td>TP*{tildes - 3}*~TT*<strong>Transaction#(must match TH02)</strong>*{tildes}*~</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default App2;

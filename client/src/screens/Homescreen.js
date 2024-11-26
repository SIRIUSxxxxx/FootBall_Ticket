//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Match from '../components/Match';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker, Space } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import moment from 'moment';
import { useTranslation } from 'react-i18next';  // Import useTranslation

const { RangePicker } = DatePicker;

function Homescreen() {
    const [fromdate, setfromdate] = useState(); // Define the state within the component
    const [todate, settodate] = useState(); // Define the state within the component
    const [match, setmatch] = useState([]); // To store the fetched match
    const [originalMatches, setOriginalMatches] = useState([]); // To store the original matches
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const { t } = useTranslation();  // Use the translation hook

    const [searchkey, setsearchkey] = useState('');
    const [type, settype] = useState('all'); // Default type is 'all'

    useEffect(() => {
        const fetchmatch = async () => {
            try {
                setloading(true);
                console.log("Fetching match...");
                const response = await axios.get('http://localhost:5000/api/match/getallmatch');
                console.log("Response data:", response.data);
                setmatch(response.data.match);
                setOriginalMatches(response.data.match); // Store the original match data
                setloading(false);
            } catch (error) {
                seterror(true);
                console.error("Error fetching match:", error);
                setloading(false);
            }
        };

        fetchmatch();
    }, []);

    function filterByDate(dates) {
        if (dates && dates.length === 2) {
            const startDate = dates[0];
            const endDate = dates[1];

            // Format the dates correctly using moment().format()
            const formattedStartDate = startDate.format('DD-MM-YYYY');
            const formattedEndDate = endDate.format('DD-MM-YYYY');

            // Log the formatted dates
            console.log(formattedStartDate);
            console.log(formattedEndDate);
            setfromdate(formattedStartDate);
            settodate(formattedEndDate);
        } else {
            // If no date is selected, reset the filter
            setfromdate(undefined);
            settodate(undefined);
        }
    }

    function filterMatches() {
        let filteredMatches = originalMatches;

        // Filter matches by both date, search key, and type
        if (fromdate && todate) {
            filteredMatches = filteredMatches.filter(match => {
                const matchDate = moment(match.date, 'DD-MM-YYYY');
                const startDate = moment(fromdate, 'DD-MM-YYYY');
                const endDate = moment(todate, 'DD-MM-YYYY');
                return matchDate.isBetween(startDate, endDate, null, '[]');
            });
        }

        filteredMatches = filteredMatches.filter(match => {
            const matchNameMatches = match.name.toLowerCase().includes(searchkey.toLowerCase());
            const matchTypeMatches = type === 'all' || match.type.toLowerCase() === type.toLowerCase();
            return matchNameMatches && matchTypeMatches;
        });

        setmatch(filteredMatches); // Update the state with filtered matches
    }

    // Run the search and type filter together when either changes
    useEffect(() => {
        filterMatches();
    }, [searchkey, type, fromdate, todate]); // Trigger when either searchkey, type, or date range changes

    return (
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-md-3 bs'>
                    <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
                </div>

                <div className='col-md-5 bs'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder={t('Search match')}
                        value={searchkey}
                        onChange={(e) => setsearchkey(e.target.value)}
                    />
                </div>
                <div className='col-md-4 bs'>
                    <select className='form-control' value={type} onChange={(e) => settype(e.target.value)}>
                        <option value='all'>{t('All')}</option>
                        <option value='HongKong'>{t('HongKong')}</option>
                        <option value='International'>{t('International')}</option>
                    </select>
                </div>
            </div>

            <div className="row justify-content-center mt-5">
                {loading ? (
                    <h1><Loader /></h1>
                ) : error ? (
                    <h1><Error /></h1>
                ) : (
                    match.map(match => {
                        return (
                            <div className="col-md-9 mt-2" key={match._id}>
                                <Match match={match} fromdate={fromdate} todate={todate} />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Homescreen;

//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

function Match({ match, fromdate, todate }) {
    const [show, setShow] = useState(false);
    const { t } = useTranslation(); // Get the translation function

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className='row bs'>
            <div className='col-md-4'>
                <img src={match.imageurls[0]} className="smallimg" alt="Match" />
            </div>
            <div className='col-md-7'>
                <h1>{match.name}</h1>
                <b>
                <p>{t('venue')}: {match.Venue}</p>
                    <p>{t('time')}: {match.Time}</p>
                    <p>{t('area')}: {match.type}</p>
                    <p>{t('date')}: {match.date}</p>
                </b>
                <div style={{ float: "right" }}>
                    {/* "Book Now" button is always visible */}
                    <Link to={`/book/${match._id}/${fromdate || null}/${todate || null}`}>
                        <button className='btn btn-primary m-2'>{t('bookNow')}</button>
                    </Link>

                    <button className="btn btn-primary" onClick={handleShow}> {t('viewDetails')}</button>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{match.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel prevLabel="" nextLabel="">
                        {match.imageurls.map((url, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100 bigimg"
                                    src={url}
                                    alt="Match Slide"
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <p>{t('description')}: {match.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    {t('close')}
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                    {t('saveChanges')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Match;

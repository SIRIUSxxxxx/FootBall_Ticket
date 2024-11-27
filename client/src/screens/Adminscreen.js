//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useState, useEffect } from "react";
import { Tabs, Table, Button, Popconfirm, Form, Input, InputNumber, DatePicker, TimePicker, message, Row , Col , Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { useTranslation } from 'react-i18next';  // Import useTranslation

function Adminscreen() {
    const [bookings, setBookings] = useState([]);
    const [matches, setMatches] = useState([]); // State to store match data
    const [users, setUsers] = useState([]); // State to store user data
    const [form] = Form.useForm(); // Form instance for add match
    const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const [newMatch, setNewMatch] = useState({}); // State to store new match data
    const { t } = useTranslation();  // Use the translation hook


    const navigate = useNavigate();  // Initialize navigate

    // Fetch bookings on component mount
    useEffect(() => {
        axios.get('http://localhost:5000/api/bookings/getallbookings')
            .then(response => {
                setBookings(response.data);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
            });
    }, []);

    // Fetch matches on component mount
    // Fetch matches and update bookings with match names
    useEffect(() => {
        axios.get('http://localhost:5000/api/matches/getallmatch')
            .then(response => {
                const matchData = response.data.match;
                setMatches(matchData);
                
                // Fetch bookings after matches are set
                axios.get('http://localhost:5000/api/bookings/getallbookings')
                    .then(response => {
                        const bookingData = response.data.map(booking => {
                            const match = matchData.find(m => m._id === booking.matchid);
                            return {
                                ...booking,
                                matchName: match ? `${match.name} [ ${match.TeamA} vs ${match.TeamB} ]` : 'Unknown Match'
                            };
                        });
                        setBookings(bookingData);
                    })
                    .catch(error => {
                        console.error('Error fetching bookings:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching matches:', error);
            });
    }, []);
    useEffect(() => {
        axios.get('http://localhost:5000/api/users/getallusers')
            .then(response => {
                setUsers(response.data); // Set the fetched users in state
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);
  

    // Delete booking handler
    const deleteBooking = (bookingId) => {
        axios.delete('http://localhost:5000/api/bookings/cancelbooking', {
            data: { bookingId }
        })
            .then(response => {
                setBookings(bookings.filter(booking => booking._id !== bookingId));  // Update UI
                alert('Booking canceled successfully');
            })
            .catch(error => {
                console.error('Error deleting booking:', error);
                alert('Failed to cancel booking');
            });
    };

    // Add new match handler
    const addMatch = (values) => {
        axios.post('http://localhost:5000/api/matches/addmatch', values)
            .then(response => {
                message.success('Match added successfully');
                form.resetFields();  // Reset the form
                setMatches([...matches, response.data.match]); // Update matches state
            })
            .catch(error => {
                message.error('Error adding match');
                console.error('Error adding match:', error);
            });
    };

    const deleteMatch = (matchId) => {
        axios.delete(`http://localhost:5000/api/matches/deletematch/${matchId}`)
            .then(response => {
                setMatches(matches.filter(match => match._id !== matchId));  // Remove match from the state
                message.success('Match deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting match:', error);
                message.error('Failed to delete match');
            });
    };

    // Define columns for the booking table
    const bookingColumns = [
        { title: t('Booking ID'), dataIndex: '_id', key: '_id' },
        { title: t('Match Name'), dataIndex: 'matchName', key: 'matchName' },
        { title: t('Match ID'), dataIndex: 'matchid', key: 'matchid' },
        { title: t('User ID'), dataIndex: 'userid', key: 'userid' },
        { title: t('Selected Seats'), dataIndex: 'selectedSeats', key: 'selectedSeats', render: seats => seats.join(', ') },
        { title: t('Total Amount'), dataIndex: 'totalamount', key: 'totalamount' },
        { title: t('Status'), dataIndex: 'status', key: 'status' },
        {
            title: t('Action'),
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title={t('Are you sure to cancel this booking?')}
                    onConfirm={() => deleteBooking(record._id)}
                    okText={t('Yes')}
                    cancelText={t('No')}
                >
                    <Button type="danger">{t('Delete')}</Button>
                </Popconfirm>
            ),
        },
    ];

    // Define columns for the matches table with the new 'Match Name' column
    const matchColumns = [
        { title: t('Match ID'), dataIndex: '_id', key: '_id' },
        { title: t('Team A'), dataIndex: 'TeamA', key: 'TeamA' },
        { title: t('Team B'), dataIndex: 'TeamB', key: 'TeamB' },
        { title: t('Date'), dataIndex: 'date', key: 'date' },
        { title: t('Match Name'), key: 'matchName', render: (text, record) => `${record.name}` },
        { title: t('Venue'), key: 'venue', render: (text, record) => `${record.Venue}` },
        {
            title: t('Action'),
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title={t('Are you sure to delete this match?')}
                    onConfirm={() => deleteMatch(record._id)}
                    okText={t('Yes')}
                    cancelText={t('No')}
                >
                    <Button type="danger">{t('Delete')}</Button>
                </Popconfirm>
            ),
        },
    ];

    const userColumns = [
        { title: t('User ID'), dataIndex: '_id', key: '_id' },
        { title: t('Name'), dataIndex: 'name', key: 'name' },
        { title: t('Email'), dataIndex: 'email', key: 'email' },
        { title: t('Is Admin'), dataIndex: 'isAdmin', key: 'isAdmin', render: isAdmin => isAdmin ? t('Yes') : t('No') },
        { title: t('Created At'), dataIndex: 'createdAt', key: 'createdAt', render: date => new Date(date).toLocaleString() },
        { title: t('Updated At'), dataIndex: 'updatedAt', key: 'updatedAt', render: date => new Date(date).toLocaleString() },
        {
            title: t('Action'),
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => viewUserDetails(record._id)}>
                    {t('View')}
                </Button>
            ),
        },
    ];

    // Function to fetch user details by ID
    const viewUserDetails = (userId) => {
        axios.get(`http://localhost:5000/api/users/getuserbyid/${userId}`)
            .then(response => {
                setSelectedUser(response.data); // Set selected user details
                setIsModalVisible(true); // Show modal with user details
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                message.error('Failed to fetch user details');
            });
    };

    // Function to close modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Function to delete user
    const deleteUser = (userId) => {
        axios.delete(`http://localhost:5000/api/users/deleteuser/${userId}`)
            .then(response => {
                // After deletion, close the modal and update the users state to remove the deleted user
                setUsers(users.filter(user => user._id !== userId));
                setIsModalVisible(false);
                message.success('User deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                message.error('Failed to delete user');
            });
    };



    return (
        <div className='mt-3 ml-3 bs'>
            <h1>{t('Admin Panel')}</h1>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab={t('Bookings')} key="1">
                    <h2>{t('Bookings')}</h2>
                    <Table dataSource={bookings} columns={bookingColumns} rowKey="_id" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={t('Match')} key="2">
                    <h2>{t('Match')}</h2>
                    <Table dataSource={matches} columns={matchColumns} rowKey="_id" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={t('Add Match')} key="3">
                    <h2>{t('Add Match')}</h2>
                    <Form form={form} onFinish={addMatch} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={t('Match Name')} name="name" rules={[{ required: true, message: t('Please input the match name!') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={t('Match Type')} name="type" rules={[{ required: true, message: t('Please input the match type!') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={t('Description')} name="description" rules={[{ required: true, message: t('Please input the description!') }]}>
                                    <Input.TextArea />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={t('Price Per Seat')} name="PricePerSeat" rules={[{ required: true, message: t('Please input the price per seat!') }]}>
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={t('Total Seats')} name="totalSeats" rules={[{ required: true, message: t('Please input the total seats!') }]}>
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={t('Time')} name="Time" rules={[{ required: true, message: t('Please input the match time!') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={t('Venue')} name="Venue" rules={[{ required: true, message: t('Please input the venue!') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={t('Team A')} name="TeamA" rules={[{ required: true, message: t('Please input Team A!') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={t('Team B')} name="TeamB" rules={[{ required: true, message: t('Please input Team B!') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item 
                                    label={t('Match Date')} 
                                    name="date" 
                                    rules={[{ required: true, message: t('Please input the match date!') }]}
                                >
                                    <Input 
                                        placeholder={t('Enter match date (DD-MM-YYYY)')} 
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label={t('Image URLs')} name="imageurls" rules={[{ required: true, message: t('Please input the image URLs!') }]}>
                                    <Input.TextArea />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">{t('Add Match')}</Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>

                <Tabs.TabPane tab={t('Users')} key="4">
                    <h2>{t('Users')}</h2>
                    <Table dataSource={users} columns={userColumns} rowKey="_id" />
                </Tabs.TabPane>
            </Tabs>

        <Modal
            title={t('User Details')}  // Translated title
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="delete" type="danger" onClick={() => deleteUser(selectedUser._id)}>
                    {t('Delete User')}
                </Button>,
                <Button key="cancel" onClick={handleCancel}>
                    {t('Cancel')}  
                </Button>,
            ]}
        >
            {selectedUser ? (
                <div>
                    <p><strong>{t('Name')}:</strong> {selectedUser.name}</p>
                    <p><strong>{t('Email')}:</strong> {selectedUser.email}</p>
                    <p><strong>{t('Password')}:</strong> {selectedUser.password}</p>
                    <p><strong>{t('Is Admin')}:</strong> {selectedUser.isAdmin ? t('Yes') : t('No')}</p>
                    <p><strong>{t('Gender')}:</strong> {selectedUser.gender}</p>
                    <p><strong>{t('NickName')}:</strong> {selectedUser.nickname}</p>
                    <p><strong>{t('Birthday')}:</strong> {selectedUser.birthday}</p>
                    <p><strong>{t('Profile Image')}:</strong> <img src={selectedUser.profileImage} alt="Profile" style={{ width: '100px' }} /></p>
                </div>
            ) : (
                <p>{t('Loading user details...')}</p>  // Translated loading text
            )}
        </Modal>
        </div>
    );
}

export default Adminscreen;

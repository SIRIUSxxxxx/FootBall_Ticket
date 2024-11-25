import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import { Tabs, Input, Button, message, Select, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';  // Import useTranslation
import jsPDF from "jspdf";

const { TabPane } = Tabs;
const { Option } = Select;

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [birthday, setBirthday] = useState(user?.birthday || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const { t } = useTranslation();  // Use the translation hook

   

    const handleSubmit = async () => {
        if (!gender || !email || !password) {
            message.error("All fields are required!");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await axios.put('http://localhost:5000/api/users/update', {
                userId: user._id,
                //name,
                email,
                password,
                nickname,
                gender,
                birthday,
                profileImage, // Send the profile image URL if changed
            });
    
            message.success(response.data.message);
    
            // Update user state with new details
            const updatedUser = { ...user, name, email, nickname, gender, birthday, profileImage };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));  // Update localStorage
            setName(updatedUser.name);  // Update local state
            setEmail(updatedUser.email);
            setNickname(updatedUser.nickname);
            setGender(updatedUser.gender);
            setBirthday(updatedUser.birthday);
            setProfileImage(updatedUser.profileImage);
    
        } catch (error) {
            console.error("Error updating profile:", error);
            message.error("There was an error updating your profile.");
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: '1',
            label: t('profile'),
            children: (
                <div className="container mt-5">
                    {user ? (
                        <div className="card shadow-lg p-4 mb-4">
                            <h1 className="text-center mb-4">{user.name} {t('profile')}</h1>
                            <div className="row align-items-center">
                                <div className="col-md-7">
                                    <h4 className="profile-info mb-3">{t('username')}: {user.name}</h4>
                                    <h4 className="profile-info mb-3">{t('email')}: {user.email}</h4>
                                    <h4 className="profile-info mb-3">{t('nickname')}: {user.nickname}</h4>
                                    <h4 className="profile-info mb-3">{t('gender')}: {user.gender}</h4>
                                    <h4 className="profile-info mb-3">{t('birthday')}: {user.birthday}</h4>
                                    <h4 className="profile-info mb-3">{t('admin')}: {user.isAdmin ? t('yes') : t('no')}</h4>
                                </div>
                                <div className="col-md-5">
                                    {user.profileImage && (
                                        <div className="profile-img-container text-center mt-3">
                                            <img 
                                                src={user.profileImage} 
                                                alt="Profile"
                                                className="profile-img" 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center">{t('pleaseLogin')}</p>
    )}
</div>

            ),
        },
        {
            key: '2',
            label: t('bookings'),
            children: <MyBookings user={user} />,
        },
        {
            key: '3',
            label: t('EditProfile'),
            children: (
                <div className="container mt-5">
                    <h2>{t('EditProfile')}</h2>
                    <div className="card shadow-lg p-4 mb-4">
                        <form>
                            <div className="form-group mb-3">
                                <label htmlFor="name">{t('username')}</label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('enterUsername')}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email">{t('email')}</label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('enterEmail')}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">{t('password')}</label>
                                <Input.Password
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('enterPassword')}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="nickname">{t('nickname')}</label>
                                <Input
                                    id="nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder={t('enterNickname')}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="gender">{t('gender')}</label>
                                <Select
                                    id="gender"
                                    value={gender}
                                    onChange={(value) => setGender(value)}
                                    style={{ width: '100%' }}
                                    placeholder={t('selectGender')}
                                >
                                    <Option value="Male">{t('male')}</Option>
                                    <Option value="Female">{t('female')}</Option>
                                </Select>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="birthday">{t('birthday')}</label>
                                <Input
                                    id="birthday"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    placeholder={t('enterBirthday')}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="profileImage">{t('profileImage')}</label>
                                <Input
                                    id="profileImage"
                                    value={profileImage}
                                    onChange={(e) => setProfileImage(e.target.value)}
                                    placeholder={t('enterProfileImage')}
                                />
                            </div>
                            <Button
                                type="primary"
                                loading={loading}
                                onClick={handleSubmit}
                                className="btn btn-primary"
                            >
                                {t('saveChanges')}
                            </Button>
                        </form>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
    );
}

export default Profilescreen;

export function MyBookings({ user }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user || !user._id) return;

            setLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/api/bookings/getbookingsbyuserid', { userid: user._id });
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };

        fetchBookings();
    }, [user]);

    const handleDownload = (booking) => {
        const doc = new jsPDF();

        // Add details to the PDF
        doc.setFont("helvetica", "bold");
        doc.text(t('Booking Payment Details'), 20, 20);

        doc.setFont("helvetica", "normal");
        doc.text(`${t('Match')}: ${booking.match?.name || t('Not available')}`, 20, 40);
        doc.text(`${t('Match ID')}: ${booking.matchid}`, 20, 50);
        doc.text(`${t('Transaction ID')}: ${booking.transactionId}`, 20, 60);
        doc.text(`${t('Status')}: ${booking.status}`, 20, 70);
        doc.text(`${t('Seats')}: ${booking.selectedSeats.join(', ')}`, 20, 80);
        doc.text(`${t('Total Amount')}: $${booking.totalamount}`, 20, 90);

        // Save the PDF
        doc.save(`${t('Payment_Details')}_${booking.matchid}.pdf`);
    };


    const handleCancel = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:5000/api/bookings/cancelbooking`, { data: { bookingId } });
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking._id === bookingId ? { ...booking, status: 'Canceled' } : booking
                )
            );
        } catch (error) {
            console.log("Error canceling booking:", error);
        }
    };
    const { t } = useTranslation();  // Use the translation hook
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h1 className="text-center mb-4">{t('My Bookings')}</h1>
                    {loading && <p className="text-center">{t('Loading')}</p>}
                    {!loading && bookings.length === 0 && <p className="text-center">{t('No bookings found.')}</p>}
                    {bookings.map((booking) => (
                        <div key={booking._id} className="card shadow-sm mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="card-title">{t('Match')}: {booking.match?.name || t('Match details not available')}</h4>
                                    <div>
                                        {booking.status !== t('Canceled') && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="btn btn-danger me-2"
                                            >
                                                {t('Cancel')}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDownload(booking)}
                                            className="btn btn-primary"
                                        >
                                            {t('Download')}
                                        </button>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <p><strong>{t('Match ID')}:</strong> {booking.matchid}</p>
                                    <p><strong>{t('Match Name')}:</strong> {booking.match?.name || t('Not available')}</p> {/* Match name added here */}
                                    <p><strong>{t('Transaction ID')}:</strong> {booking.transactionId}</p>
                                    {/* <p><strong>{t('From Date')}:</strong> {new Date(booking.fromdate).toLocaleString()}</p>
                                    <p><strong>{t('To Date')}:</strong> {new Date(booking.todate).toLocaleString()}</p> */}
                                    <p><strong>{t('Status')}:</strong> {booking.status}</p>
                                    <p><strong>{t('Seats')}:</strong> {booking.selectedSeats.join(', ')}</p>
                                    <p><strong>{t('Total Amount')}:</strong> ${booking.totalamount}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

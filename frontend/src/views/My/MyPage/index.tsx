import BottomNavigation from "../../../components/BottomNavigation";
import MyReservations from "../MyReservations";
import MyProfile from "../MyProfile";
import {useState} from "react";
import './style.css';

export default function MyPage() {
    const [activeTab, setActiveTab] = useState<'reservations' | 'profile'>('reservations');

    return (
        <>
            <div className="my-page-wrapper">
                <div className="my-page-tab-container">
                    <button
                        className={`my-page-tab ${activeTab === 'reservations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reservations')}
                    >
                        나의 예약
                    </button>
                    <button
                        className={`my-page-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        프로필
                    </button>
                </div>

                {activeTab === 'reservations' ? <MyReservations /> : <MyProfile />}
            </div>
        </>
    );
}
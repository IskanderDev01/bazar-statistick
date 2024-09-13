import { useState, useEffect } from 'react';
import { Navbar } from '@/widgets/navbar';
import { UnknownHeader } from '../header/UnknownHeader';
import {
    useGetUnknownDate,
    useGetUnknownLimit,
    useGetUnknownPage,
} from '@/entities/unknown/model/selectors/unknownSelectors';
import { UnknownTable } from '../table/UnknownTable';
import { useGetUnknownCars } from '@/entities/unknown/api/unknownApi';
import { getDefaultDateDay } from '@/shared/lib/defaultDate/defaultDate';
import { Count } from '@/shared/ui';
import { Modal, Input, Button } from 'antd';  
import 'antd/dist/reset.css';

const PasswordModal = ({ onSubmit }) => {
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(password);
    };

    return (
        <Modal
            title="Введите пароль"
            visible={true}
            footer={null}
            closable={false}
        >
            <Input.Password
                value={password}
                onChange={handlePasswordChange}
                placeholder="Введите пароль"
            />
            <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: '10px' }}
            >
                Войти
            </Button>
        </Modal>
    );
};

export const Unknown = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const date = useGetUnknownDate();
    const limit = useGetUnknownLimit();
    const page = useGetUnknownPage();
    const selectedDate = date || getDefaultDateDay();
    const { data } = useGetUnknownCars(
        { limit, page, date: selectedDate },
        { pollingInterval: 25000, refetchOnFocus: false },
    );

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated');
        if (isAuth === 'true') {
            setIsAuthenticated(true);
        } else {
            setIsModalOpen(true);
        }
    }, []);

    const handlePasswordSubmit = (password: string) => {
        const correctPassword = '1221';

        if (password === correctPassword) {
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            setIsModalOpen(false);
        } else {
            alert('Неверный пароль');
        }
    };

    return (
        <>
            {isModalOpen && <PasswordModal onSubmit={handlePasswordSubmit} />}
            {isAuthenticated && (
                <>
                    <Navbar />
                    <div className="container mx-auto px-[5%] pb-10">
                        <UnknownHeader />
                        <UnknownTable
                            limit={limit}
                            page={page}
                            data={data?.unknown_cars}
                            total={data?.total_attendance}
                        />
                        <Count
                            flag="cars"
                            count={data?.total_attendance}
                            title="Поток машин"
                        />
                    </div>
                </>
            )}
        </>
    );
};

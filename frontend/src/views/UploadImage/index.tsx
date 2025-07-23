import React, { useState } from 'react';
import axios from 'axios';
import {createGameRequest} from "../../apis";
import {ResponseCode} from "../../types/enums";
import {GameListResponseDto} from "../../apis/response/game";
import UploadResponseDto from "../../apis/response/admin/upload.response.dto";
import UploadRequestDto from "../../apis/request/admin/upload.request.dto";
import './style.css'
import InputBox from "../../components/InputBox";
import {useNavigate} from "react-router-dom";
import { genreOptions } from '../../types/genreOptions';
import { systemOptions } from '../../types/systemOptions';
import Select from "react-select";


export default function UploadImage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string>('');


    const [form, setForm] = useState({
        name: '',
        description: '',
        minPlayers: 2,
        maxPlayers: 4,
        age: '',
        time: '',
        genres: [] as string[],
        systems: [] as string[],
        barcode: ''
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'genres' || name === 'systems') {
            const values = value.split(',').map(v => v.trim());
            setForm(prev => ({ ...prev, [name]: values }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("이미지를 선택해주세요.");
            return;
        }

        const gameData: UploadRequestDto = {
            ...form,
            imageUrl: '',
        };

        const result = await createGameRequest(file, gameData);
        if (!result || result.code !== ResponseCode.SUCCESS) {
            alert(result?.message || '업로드 실패');
            return;
        }

        const uploadResult = result as UploadResponseDto;

        if (uploadResult.url) {
            setUploadedUrl(uploadResult.url);
            alert("보드게임 등록 성공!");
        } else {
            alert("이미지 URL을 받지 못했습니다.");
        }

        setForm({
            name: '',
            description: '',
            minPlayers: 2,
            maxPlayers: 4,
            age: '',
            time: '',
            genres: [],
            systems: [],
            barcode: ''
        });
        setFile(null);
    };

    return (
        <div id="upload-game-wrapper">
            <div className="upload-game-container">
                <div className="upload-game-box">
                    <div className="upload-game-title">보드게임 등록</div>
                    <div className="upload-game-content-box">
                        <div className="upload-game-content-input-box">
                            <label>이름</label>
                            <input className="upload-form-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="보드게임 이름" />

                            <label>설명</label>
                            <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} className="upload-form-textarea" />

                            <label>최소 인원</label>
                            <input className="upload-form-input" type="number" name="minPlayers" value={form.minPlayers} onChange={handleChange} />

                            <label>최대 인원</label>
                            <input className="upload-form-input" type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange} />

                            <label>권장 연령</label>
                            <input className="upload-form-input" type="text" name="age" value={form.age} onChange={handleChange} placeholder="예: 만 10세 이상" />

                            <label>플레이 시간</label>
                            <input className="upload-form-input" type="text" name="time" value={form.time} onChange={handleChange} placeholder="예: 30분" />

                            <label>장르</label>
                            <Select
                                isMulti
                                name="genres"
                                options={genreOptions}
                                className="react-select-container"
                                classNamePrefix="select"
                                value={genreOptions.filter(option => form.genres.includes(option.value))}
                                onChange={(selected) =>
                                    setForm(prev => ({
                                        ...prev,
                                        genres: selected.map(option => option.value)
                                    }))
                                }
                            />

                            <label>게임 시스템</label>
                            <Select
                                isMulti
                                name="systems"
                                options={systemOptions}
                                className="react-select-container"
                                classNamePrefix="select"
                                value={systemOptions.filter(option => form.systems.includes(option.value))}
                                onChange={(selected) =>
                                    setForm(prev => ({
                                        ...prev,
                                        systems: selected.map(option => option.value)
                                    }))
                                }
                            />

                            <label>바코드</label>
                            <input className="upload-form-input" type="text" name="barcode" value={form.barcode} onChange={handleChange} placeholder="예: CATANA-01" />

                            <label>이미지 업로드</label>
                            <input type="file" onChange={handleFileChange} accept="image/*" className="upload-form-input" />
                        </div>

                        <div className="upload-game-content-button-box">
                            <div className="primary-button-lg full-width" onClick={handleSubmit}>등록하기</div>
                            <div className="text-link-lg full-width" onClick={() => navigate('/')}>메인으로</div>
                        </div>

                        {uploadedUrl && (
                            <p className="upload-url">
                                이미지 URL: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

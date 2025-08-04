import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import { getGameByBarcodeRequest, updateGameRequest } from "../../../apis";
import { ResponseCode } from "../../../types/enums";
import UploadRequestDto from "../../../apis/request/admin/upload.request.dto";
import { genreOptions } from '../../../types/genreOptions';
import { systemOptions } from '../../../types/systemOptions';
import { GameResponseDto } from '../../../apis/response/game';
import './style.css'; // UploadGame과 동일한 CSS 사용

type SelectOption = { value: string, label: string };

// This component is now responsible for editing games via barcode lookup
export default function EditGame() {
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // State for the barcode input and to track if a game is loaded
    const [searchBarcode, setSearchBarcode] = useState('');
    const [isGameLoaded, setIsGameLoaded] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
        minPlayers: 0,
        maxPlayers: 0,
        bestPlayers: 0,
        age: 0,
        minPlayTime: 0,
        maxPlayTime: 0,
        weight: 0.0,
        genres: [] as SelectOption[],
        systems: [] as SelectOption[],
        imageUrl: '',
        quantity: 1 // Quantity is not edited
    });

    const handleLoadGame = async () => {
        if (!searchBarcode.trim()) {
            toast.warn("Please enter a barcode to search.");
            return;
        }

        setIsLoadingData(true);
        const response = await getGameByBarcodeRequest(searchBarcode);
        setIsLoadingData(false);

        if (!response || response.code !== ResponseCode.SUCCESS) {
            toast.error(response?.message || "Could not find game information.");
            setIsGameLoaded(false);
            return;
        }

        const data = response as GameResponseDto;
        setForm({
            name: data.name,
            description: data.description,
            minPlayers: data.minPlayers,
            maxPlayers: data.maxPlayers,
            bestPlayers: data.bestPlayers,
            age: data.age,
            minPlayTime: data.minPlayTime,
            maxPlayTime: data.maxPlayTime,
            weight: data.weight,
            genres: data.genres.map(g => ({ value: g, label: g })),
            systems: data.systems.map(s => ({ value: s, label: s })),
            imageUrl: data.imageUrl,
            quantity: 1
        });
        setIsGameLoaded(true);
        toast.success(`'${data.name}' loaded successfully.`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const intFields = ['minPlayers', 'maxPlayers', 'bestPlayers', 'age', 'minPlayTime', 'maxPlayTime', 'quantity'];
        const floatFields = ['weight'];

        if (intFields.includes(name)) {
            setForm(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
        } else if (floatFields.includes(name)) {
            setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0.0 }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setForm(prev => ({ ...prev, imageUrl: '' }));
        }
    };

    const handleSubmit = async () => {
        if (!searchBarcode) return;

        if (!form.name.trim()) return toast.warn("Game name is required.");
        if (form.maxPlayers < form.minPlayers) return toast.warn("Max players cannot be less than min players.");

        setIsSubmitting(true);

        const gameData: UploadRequestDto = {
            name: form.name,
            description: form.description,
            minPlayers: form.minPlayers,
            maxPlayers: form.maxPlayers,
            bestPlayers: form.bestPlayers,
            age: form.age,
            minPlayTime: form.minPlayTime,
            maxPlayTime: form.maxPlayTime,
            weight: form.weight,
            genres: form.genres.map(option => option.value),
            systems: form.systems.map(option => option.value),
            imageUrl: form.imageUrl,
            quantity: form.quantity
        };

        const result = await updateGameRequest(searchBarcode, file, gameData);

        setIsSubmitting(false);

        if (!result || result.code !== ResponseCode.SUCCESS) {
            return toast.error(result?.message || 'Failed to update game.');
        }

        toast.success("Game updated successfully!");
        navigate('/');
    };

    const isFormDisabled = isSubmitting || isLoadingData;

    return (
        <div id="upload-game-wrapper">
            <div className="upload-game-container">
                <div className="upload-game-box">
                    <div className="upload-game-title">보드게임 수정</div>

                    {isFormDisabled && <div className="loading-overlay"><ClipLoader size={50} color="#007bff" /></div>}

                    <div className="edit-game-section">
                        <label>바코드로 게임 조회</label>
                        <div className="ai-generate-group">
                            <input
                                className="upload-form-input"
                                type="text"
                                value={searchBarcode}
                                onChange={(e) => setSearchBarcode(e.target.value)}
                                placeholder="수정할 게임 바코드 입력"
                                disabled={isFormDisabled}
                            />
                            <button onClick={handleLoadGame} className="ai-generate-button" disabled={isFormDisabled}>
                                불러오기
                            </button>
                        </div>
                    </div>

                    <hr className="divider" />

                    {isGameLoaded && (
                        <fieldset disabled={isFormDisabled} className="upload-game-content-box">
                            <div className="upload-game-content-input-box">
                                <label>이름</label>
                                <input className="upload-form-input" type="text" name="name" value={form.name} onChange={handleChange}/>
                                <label>설명</label>
                                <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} className="upload-form-textarea"/>
                                <label>최소 인원</label>
                                <input className="upload-form-input" type="number" name="minPlayers" value={form.minPlayers} onChange={handleChange}/>
                                <label>최대 인원</label>
                                <input className="upload-form-input" type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange}/>
                                <label>베스트 인원</label>
                                <input className="upload-form-input" type="number" name="bestPlayers" value={form.bestPlayers} onChange={handleChange}/>
                                <label>권장 연령</label>
                                <div className="upload-form-input-group">
                                    <span>만</span>
                                    <input className="upload-form-input" type="number" name="age" value={form.age} onChange={handleChange} placeholder="10"/>
                                    <span>세 이상</span>
                                </div>
                                <label>최소 플레이 시간</label>
                                <div className="upload-form-input-group">
                                    <input className="upload-form-input" type="number" name="minPlayTime" value={form.minPlayTime} onChange={handleChange} placeholder="30"/>
                                    <span>분</span>
                                </div>
                                <label>최대 플레이 시간</label>
                                <div className="upload-form-input-group">
                                    <input className="upload-form-input" type="number" name="maxPlayTime" value={form.maxPlayTime} onChange={handleChange} placeholder="60"/>
                                    <span>분</span>
                                </div>
                                <label>게임 난이도 (Weight)</label>
                                <input className="upload-form-input" type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange} placeholder="5점 만점"/>
                                <label>장르</label>
                                <Select isMulti name="genres" options={genreOptions} className="react-select-container" classNamePrefix="select" value={form.genres} onChange={(selected) => setForm((prev) => ({ ...prev, genres: selected as SelectOption[] }))}/>
                                <label>게임 시스템</label>
                                <Select isMulti name="systems" options={systemOptions} className="react-select-container" classNamePrefix="select" value={form.systems} onChange={(selected) => setForm((prev) => ({ ...prev, systems: selected as SelectOption[] }))}/>

                                <label>이미지 업로드 (변경 시에만 선택)</label>
                                <input type="file" onChange={handleFileChange} accept="image/*" className="upload-form-input"/>

                                {file ? (
                                    <div style={{ marginTop: '12px', fontSize: '14px', color: '#333' }}>
                                        <label>새 이미지</label>
                                        <p>{file.name}</p>
                                    </div>
                                ) : form.imageUrl && (
                                    <div style={{ marginTop: '12px' }}>
                                        <label>현재 이미지</label>
                                        <img src={form.imageUrl} alt="현재 이미지 미리보기" style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginTop: 8 }}/>
                                    </div>
                                )}
                            </div>
                            <div className="upload-game-content-button-box">
                                <button className="primary-button-lg full-width" onClick={handleSubmit} disabled={isFormDisabled}>
                                    {isSubmitting ? <ClipLoader size={20} color="#fff" /> : '수정하기'}
                                </button>
                                <div className="text-link-lg full-width" onClick={() => navigate('/')}>
                                    메인으로
                                </div>
                            </div>
                        </fieldset>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import axios from 'axios';
import {createGameByUrlRequest, createGameRequest, generateGameInfoRequest} from "../../apis";
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
import {toast} from "react-toastify";
import {ClipLoader} from "react-spinners";
import GeneratedGameInfoResponseDto
    from "../../apis/response/admin/generated-game-info.response.dto";

type SelectOption = { value: string, label: string };

export default function UploadGame() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string>('');
    const [boardGameName, setBoardGameName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
        minPlayers: 2,
        maxPlayers: 4,
        age: 0,
        time: 0,
        genres: [] as SelectOption[],
        systems: [] as SelectOption[],
        barcode: '',
        imageUrl: ''
    });

    const navigate = useNavigate();


    const handleGenerateClick = async () => {
        if (!boardGameName.trim()) {
            toast.warn("보드게임 이름을 입력해주세요.");
            return;
        }
        setIsGenerating(true);
        const response = await generateGameInfoRequest(boardGameName);
        setIsGenerating(false);

        if (!response || response.code !== ResponseCode.SUCCESS) {
            toast.error(response?.message || "정보 생성에 실패했습니다.");
            return;
        }

        const data = response as GeneratedGameInfoResponseDto;
        setForm({
            ...form,
            name: boardGameName, // 이름은 입력값으로 설정
            description: data.description,
            minPlayers: data.minPlayers,
            maxPlayers: data.maxPlayers,
            age: data.age,
            time: data.time,
            genres: data.genres.map(g => ({ value: g, label: g })),
            systems: data.systems.map(s => ({ value: s, label: s })),
            imageUrl: data.imageUrl
        });
        setUploadedUrl(data.imageUrl);
        toast.success("AI가 정보를 자동으로 채웠습니다!");
    };

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
        let result;

        const gameData: UploadRequestDto = {
            name: form.name,
            description: form.description,
            minPlayers: form.minPlayers,
            maxPlayers: form.maxPlayers,
            age: form.age,
            time: form.time,
            genres: form.genres.map(option => option.value),
            systems: form.systems.map(option => option.value),
            barcode: form.barcode,
            imageUrl: form.imageUrl, // AI URL 있는 경우만 의미 있음
        };

        if (file) {
            // 파일 업로드 API
            result = await createGameRequest(file, gameData);
        } else if (form.imageUrl) {
            // URL 기반 업로드 API
            result = await createGameByUrlRequest(gameData);
        } else {
            alert("이미지를 선택하거나 AI로 생성해주세요.");
            return;
        }

        if (!result || result.code !== ResponseCode.SUCCESS) {
            alert(result?.message || '업로드 실패');
            return;
        }

        alert("보드게임 등록 성공!");
        setForm({ name: '', description: '', minPlayers: 2, maxPlayers: 4, age: 0, time: 0, genres: [], systems: [], barcode: '', imageUrl: '' });
        setFile(null);
        setUploadedUrl('');


    };

    return (
        <div id="upload-game-wrapper">
            <div className="upload-game-container">
                <div className="upload-game-box">
                    <div className="upload-game-title">보드게임 등록</div>
                    <div className="upload-game-content-box">
                        <div className="upload-game-content-input-box">
                            <label>보드게임 이름 (AI 생성용)</label>
                            <div className="ai-generate-group">
                                <input
                                    className="upload-form-input"
                                    type="text"
                                    value={boardGameName}
                                    onChange={(e) => setBoardGameName(e.target.value)}
                                    placeholder="예: 카탄"
                                    disabled={isGenerating} // ✅ 비활성화 추가
                                />
                                <button onClick={handleGenerateClick} disabled={isGenerating} className="ai-generate-button">
                                    {isGenerating ? <ClipLoader size={20} color="#fff" /> : 'AI로 생성'}
                                </button>
                            </div>
                            <hr className="divider" />
                            <label>이름</label>
                            <input className="upload-form-input" type="text" name="name" value={form.name} onChange={handleChange} disabled={isGenerating} />
                            <label>설명</label>
                            <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} className="upload-form-textarea" disabled={isGenerating} />
                            <label>최소 인원</label>
                            <input className="upload-form-input" type="number" name="minPlayers" value={form.minPlayers} onChange={handleChange} disabled={isGenerating} />
                            <label>최대 인원</label>
                            <input className="upload-form-input" type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange} disabled={isGenerating} />
                            <label>권장 연령</label>
                            <div className="upload-form-input-group">
                                <span>만</span>
                                <input className="upload-form-input" type="number" name="age" value={form.age} onChange={handleChange} placeholder="10" disabled={isGenerating} />
                                <span>세 이상</span>
                            </div>
                            <label>플레이 시간</label>
                            <div className="upload-form-input-group">
                                <input className="upload-form-input" type="number" name="time" value={form.time} onChange={handleChange} placeholder="30" disabled={isGenerating} />
                                <span>분</span>
                            </div>
                            <label>장르</label>
                            <Select
                                isMulti
                                name="genres"
                                options={genreOptions}
                                className="react-select-container"
                                classNamePrefix="select"
                                value={form.genres}
                                onChange={(selected) => setForm(prev => ({ ...prev, genres: selected as SelectOption[] }))}
                                isDisabled={isGenerating} // ✅ Select 컴포넌트는 isDisabled prop 사용
                            />
                            <label>게임 시스템</label>
                            <Select
                                isMulti
                                name="systems"
                                options={systemOptions}
                                className="react-select-container"
                                classNamePrefix="select"
                                value={form.systems}
                                onChange={(selected) => setForm(prev => ({ ...prev, systems: selected as SelectOption[] }))}
                                isDisabled={isGenerating} // ✅ Select 컴포넌트는 isDisabled prop 사용
                            />
                            <label>바코드</label>
                            <input className="upload-form-input" type="text" name="barcode" value={form.barcode} onChange={handleChange} placeholder="예: CATANA-01" disabled={isGenerating} />
                            <label>이미지 업로드</label>
                            <input type="file" onChange={handleFileChange} accept="image/*" className="upload-form-input" disabled={isGenerating} />
                            {form.imageUrl && (
                                <div style={{ marginTop: '12px' }}>
                                    <label>미리보기</label>
                                    <img
                                        src={form.imageUrl}
                                        alt="AI 이미지 미리보기"
                                        style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginTop: 8 }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="upload-game-content-button-box">
                            <div className={`primary-button-lg full-width ${isGenerating ? 'disabled' : ''}`} onClick={handleSubmit}>등록하기</div>
                            <div className={`text-link-lg full-width ${isGenerating ? 'disabled' : ''}`} onClick={() => !isGenerating && navigate('/')}>메인으로</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

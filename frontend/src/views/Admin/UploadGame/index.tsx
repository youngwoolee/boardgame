import React, {useState} from 'react';
import {createGameByUrlRequest, createGameRequest, generateGameInfoRequest} from "../../../apis";
import {ResponseCode} from "../../../types/enums";
import UploadRequestDto from "../../../apis/request/admin/upload.request.dto";
import './style.css'
import {useNavigate} from "react-router-dom";
import {genreOptions} from '../../../types/genreOptions';
import {systemOptions} from '../../../types/systemOptions';
import Select from "react-select";
import {toast} from "react-toastify";
import {ClipLoader} from "react-spinners";
import GeneratedGameInfoResponseDto
    from "../../../apis/response/admin/generated-game-info.response.dto";

type SelectOption = { value: string, label: string };

export default function UploadGame() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string>('');
    const [boardGameName, setBoardGameName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        minPlayers: 2,
        maxPlayers: 4,
        bestPlayers: 0,
        age: 0,
        minPlayTime: 0,
        maxPlayTime: 0,
        weight: 0.0,
        genres: [] as SelectOption[],
        systems: [] as SelectOption[],
        imageUrl: '',
        quantity: 1
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
            name: boardGameName,
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
            imageUrl: data.imageUrl
        });
        setUploadedUrl(data.imageUrl);
        toast.success("AI가 정보를 자동으로 채웠습니다!");
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
        }
    };

    const handleSubmit = async () => {

        if (!form.name.trim()) return toast.warn("게임 이름을 입력해주세요.");
        if (!form.description.trim()) return toast.warn("게임 설명을 입력해주세요.");
        if (!form.minPlayers || form.minPlayers < 1) return toast.warn("최소 인원을 올바르게 입력해주세요.");
        if (!form.maxPlayers || form.maxPlayers < form.minPlayers) return toast.warn("최대 인원은 최소 인원보다 작을 수 없습니다.");
        if (form.age <= 0) return toast.warn("권장 연령을 입력해주세요.");
        if (!form.bestPlayers || form.bestPlayers <= 0|| form.bestPlayers < form.minPlayers) return toast.warn("베스트 인원을 입력해주세요.");
        if (!form.minPlayTime || form.minPlayTime <= 0) return toast.warn("최소 플레이 시간을 입력해주세요.");
        if (!form.maxPlayTime || form.maxPlayTime <= 0) return toast.warn("최대 플레이 시간을 입력해주세요.");
        if (!form.weight || form.weight <= 0) return toast.warn("난이도를 소수점 첫번째 자리까지 입력해주세요.");
        if (!form.genres || form.genres.length === 0) return toast.warn("장르를 하나 이상 선택해주세요.");
        if (!form.systems || form.systems.length === 0) return toast.warn("게임 시스템을 하나 이상 선택해주세요.");
        if (form.quantity <= 0) return toast.warn("수량을 입력해주세요.");
        if (!file && !form.imageUrl) return toast.warn("이미지를 업로드하거나 AI 생성 이미지가 있어야 합니다.");

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

        let result;


        if (file) {
            result = await createGameRequest(file, gameData);
        } else if (form.imageUrl) {
            result = await createGameByUrlRequest(gameData);
        } else {
            toast.warn("이미지를 선택하거나 AI로 생성해주세요.");
            setIsSubmitting(false);
            return;
        }


        setIsSubmitting(false);

        if (!result || result.code !== ResponseCode.SUCCESS) {
            alert(result?.message || '업로드 실패');
            return;
        }

        // Reset form
        toast.success("보드게임 등록 성공!");
        // 폼 초기화
        setForm({ name: '', description: '', minPlayers: 2, maxPlayers: 4, bestPlayers: 0, age: 0, minPlayTime: 0, maxPlayTime: 0, weight: 0.0, genres: [], systems: [], imageUrl: '', quantity: 1 });
        setFile(null);


    };

    const isFormDisabled = isGenerating || isSubmitting;

    return (
        <div id="upload-game-wrapper">
            <div className="upload-game-container">
                <div className="upload-game-box">
                    <div className="upload-game-title">보드게임 등록</div>
                    {(isGenerating || isSubmitting) && (
                        <div className="loading-overlay">
                            <ClipLoader size={50} color="#007bff" />
                        </div>
                    )}
                    <div className="upload-game-section">
                        <label>보드게임 이름 (AI 생성용)</label>
                        <div className="ai-generate-group">
                            <input className="upload-form-input" type="text" value={boardGameName} onChange={(e) => setBoardGameName(e.target.value)} placeholder="예: 카탄"/>
                            <button onClick={handleGenerateClick} className="ai-generate-button">AI로 생성</button>
                        </div>
                    </div>
                    <hr className="divider" />
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
                            <input className="upload-form-input" type="number" step="0.01" name="weight" value={form.weight} onChange={handleChange} placeholder="5점 만점"/>
                            <label>장르</label>
                            <Select isMulti name="genres" options={genreOptions} className="react-select-container" classNamePrefix="select" value={form.genres} onChange={(selected) => setForm((prev) => ({ ...prev, genres: selected as SelectOption[] }))}/>
                            <label>게임 시스템</label>
                            <Select isMulti name="systems" options={systemOptions} className="react-select-container" classNamePrefix="select" value={form.systems} onChange={(selected) => setForm((prev) => ({ ...prev, systems: selected as SelectOption[] }))}/>
                            <label>수량</label>
                            <input className="upload-form-input" type="number" name="quantity" value={form.quantity} min={1} onChange={handleChange}/>
                            <label>이미지 업로드</label>
                            <input type="file" onChange={handleFileChange} accept="image/*" className="upload-form-input"/>
                            {form.imageUrl && (
                                <div style={{ marginTop: '12px' }}>
                                    <label>미리보기</label>
                                    <img src={form.imageUrl} alt="AI 이미지 미리보기" style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginTop: 8 }}/>
                                </div>
                            )}
                        </div>
                        <div className="upload-game-content-button-box">
                            <button className="primary-button-lg full-width" onClick={handleSubmit} disabled={isFormDisabled}>
                                {isSubmitting ? <ClipLoader size={20} color="#fff" /> : '등록하기'}
                            </button>
                            <div className="text-link-lg full-width" onClick={() => navigate('/')}>
                                메인으로
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
    );
}

// UploadImage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import {uploadImageToGithubRequest} from "../../apis";
import {ResponseCode} from "../../types/enums";
import {GameListResponseDto} from "../../apis/response/game";
import UploadResponseDto from "../../apis/response/admin/upload.response.dto";

const UploadImage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const result = await uploadImageToGithubRequest(file);

        if (!result) {
            alert('업로드 중 오류가 발생했습니다.');
            return;
        }

        if (result.code === ResponseCode.DATABASE_ERROR) {
            alert('데이터베이스 오류입니다.');
            return;
        }

        if (result.code !== ResponseCode.SUCCESS) {
            alert('업로드 실패: ' + result.message);
            return;
        }

        // 타입 캐스팅
        const uploadResult = result as UploadResponseDto;

        if (uploadResult.url) {
            setUploadedUrl(uploadResult.url);
            console.log("업로드 성공:", uploadResult.url);
        } else {
            alert("업로드 결과에 URL이 없습니다.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>GitHub 업로드</button>
            {uploadedUrl && <p>업로드된 URL: <a href={uploadedUrl}>{uploadedUrl}</a></p>}
        </div>
    );
};

export default UploadImage;
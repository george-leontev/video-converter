import axios from 'axios';
import { Input, Button, Typography, Snackbar } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { HttpConstants } from './constants/app-http-constants';
import routes from './constants/app-api-routes';
import { UploadedLinkFileModel } from './models/uploaded-link-file-model';

import './App.css';

function App() {
    const [fileName, setFileName] = useState<string>('');
    const [outputFileName, setOutputFileName] = useState<UploadedLinkFileModel>();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLElement>(null);

    const uploadFileAsync = useCallback(async (formData: FormData) => {
        try {
            setIsDownloading(false);
            setIsUploading(true);
            const response = await axios.request({
                method: 'POST',
                url: `${routes.host}${routes.uploadedFile}`,
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formData,
            });

            if (response && response.status === HttpConstants.StatusCodes.Created) {
                setOutputFileName({ link: response.data });
                setFileName('');
                if (fileInputRef.current) {
                    (fileInputRef.current.firstChild as HTMLInputElement).value = '';
                }

                return response.data as UploadedLinkFileModel;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsUploading(false);
            setIsDownloading(true);
        }
    }, [setIsUploading, setOutputFileName]);

    const downloadFileAsync = useCallback(async (fileName: string) => {
        try {
            const response = await axios.request({
                method: 'GET',
                url: `${routes.host}${routes.dowloadedFile}/${fileName}`,
                responseType: 'blob'
            });

            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                const downloadUrl = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(downloadUrl);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsDownloading(false);
        }
    }, []);

    const uploadAsync = useCallback(async () => {
        const fileUploadForm = document.getElementById('file-upload-form');
        if (!fileUploadForm) {
            return;
        }
        const formData = new FormData(fileUploadForm as HTMLFormElement);
        const fileUploadElement = document.getElementById('file-upload') as HTMLInputElement;
        if (fileUploadElement && fileUploadElement.files!.length > 0) {
            await uploadFileAsync(formData);
        }
    }, [uploadFileAsync]);

    const addFileHandler = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) {
            return;
        }
        const [file] = event.target.files;

        if (!file.name.toLowerCase().split('.').includes('mov')) {
            setIsToastVisible(true);
            return;
        }

        setFileName(file.name);
        await uploadAsync();

    }, [uploadAsync, setIsToastVisible]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '100px',
                padding: '50px',
                width: '600px',
                height: '400px',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #1d76d2',
                borderRadius: '10px'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <form id="file-upload-form" encType="multipart/form-data">
                    <Input
                        type="file"
                        id="file-upload"
                        name="fileUpload"
                        inputProps={{ accept: 'video/*' }}
                        onChange={addFileHandler}
                        style={{ display: 'none' }}
                        disabled={isUploading}
                        ref={fileInputRef}
                    />
                    <label htmlFor="file-upload">
                        <Button variant="contained" component="span" disabled={isUploading} style={{ color: 'white' }}>
                            {isUploading ? 'Uploading...' : 'Choose File'}
                        </Button>
                    </label>
                </form>
                {fileName && <Typography variant="body1">{fileName}</Typography>}
            </div>
            {isDownloading ?
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Button
                        variant="outlined"
                        component="span"
                        onClick={() => {
                            downloadFileAsync(outputFileName!.link);
                        }}
                    >
                        Download
                    </Button>
                    {outputFileName && <Typography variant="body1">{outputFileName.link}</Typography>}
                </div> : null
            }

            <Snackbar
                open={isToastVisible}
                message='Only .mov files are allowed!'
                autoHideDuration={3000}
                onClose={() => setIsToastVisible(false)}
            />
        </div>
    );
}

export default App;

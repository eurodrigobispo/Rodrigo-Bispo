
export enum AppMode {
    CREATE = 'create',
    EDIT = 'edit'
}

export enum CreateFunction {
    FREE = 'free',
    FUSION_MODE = 'fusion-mode',
}

export enum EditFunction {
    ADD_REMOVE = 'add-remove',
    STYLE = 'style',
    RETOUCH = 'retouch',
    COMPOSE = 'compose'
}

export enum AspectRatio {
    SQUARE = '1:1',
    LANDSCAPE = '16:9',
    PORTRAIT = '9:16'
}

export enum CreateStyle {
    CINEMATIC = 'cinematic',
    'EIGHT_K' = '8k',
    REALISTIC = 'realistic',
    ILLUSTRATION = 'illustration'
}

export enum ViewState {
    PLACEHOLDER = 'placeholder',
    LOADING = 'loading',
    IMAGE = 'image'
}

export interface ImageFile {
    file: File;
    previewUrl: string;
}

export interface GenerationConfig {
    prompt: string;
    mode: AppMode;
    createFn: CreateFunction;
    editFn: EditFunction;
    aspectRatio: AspectRatio;
    createStyle: CreateStyle | null;
    image1: ImageFile | null;
    image2: ImageFile | null;
    image3: ImageFile | null;
}

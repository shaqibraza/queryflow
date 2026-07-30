import { DatasetRepository } from "../repositories/dataset.repository.js";


export class DatasetService {
    constructor(private readonly datasetRepository = new DatasetRepository) { }

    async createDataset(data: {
        name: string;
        description?: string;
        ownerId: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        storageKey: string;
    }) {
        return this.datasetRepository.create(data);
    }
}
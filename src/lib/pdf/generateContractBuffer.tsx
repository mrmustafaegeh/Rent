import { renderToStream } from '@react-pdf/renderer';
import { RentalContract } from './RentalContract';
import React from 'react';

export const generateContractBuffer = async (booking: any): Promise<Buffer> => {
    const stream = await renderToStream(<RentalContract booking={booking} />);
    
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (err) => reject(err));
    });
};

import path from 'path';
import { generate } from '../';

export default () => generate(path.join(__dirname, './config/doc.js'));

import * as dotenv from 'dotenv';
import { getConfigFile } from '../shared/config.helper';

dotenv.config({ path: `config/${getConfigFile()}.env` });

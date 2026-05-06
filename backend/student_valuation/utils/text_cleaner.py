import re
import string

class TextCleaner:
    @staticmethod
    def clean_text(raw_text):
        """
        Removes OCR noise, standardizes whitespace, and prepares text for NLP.
        """
        if not raw_text:
            return ""

        # 1. Convert to lowercase for uniformity
        text = raw_text.lower()

        # 2. Remove common OCR 'junk' characters (like | _ ~ \ )
        # We keep periods, commas, and pluses (for C++)
        junk_pattern = r'[|~\\_\[\]\{\}]'
        text = re.sub(junk_pattern, ' ', text)

        # 3. Fix common OCR mistakes
        # Sometimes '0' is read as 'O' or '1' as 'I' in a GPA context
        # We handle that specifically in the extractor, but we clean the basics here
        text = text.replace('\n', ' ')

        # 4. Remove multiple spaces
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    @staticmethod
    def extract_keywords_only(text):
        """
        Optional: Returns only alphanumeric words, 
        useful for quick keyword matching.
        """
        return re.findall(r'\b\w+\b', text.lower())

def clean_ocr_output(raw_text):
    cleaner = TextCleaner()
    return cleaner.clean_text(raw_text)
from app.core.crud import CRUDBase
from app.models.domain import QuestionBank, StudyMaterial

class CRUDQuestionBank(CRUDBase[QuestionBank, QuestionBank, QuestionBank]):
    pass

class CRUDStudyMaterial(CRUDBase[StudyMaterial, StudyMaterial, StudyMaterial]):
    pass

question_bank = CRUDQuestionBank(QuestionBank)
study_material = CRUDStudyMaterial(StudyMaterial)

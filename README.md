# avaros-helper
Chrome extension to enhance [Avaros](https://www.avaros.ca/) Oscar EMR to display usefull summary of information in a sidepanel

## Features
- Displays summary data (age, sex, height, weight, BMI, LMP & EDD)
- Med Calc References (with some autocomplete)
- Preventative Health Measures (based on [Female Preventive Care Checklist Form](https://www.cfpc.ca/CFPC/media/Resources/Periodic-Health-Examination/PreventiveCareChecklistFemaleEnglish2019.pdf) & [Male Preventive Care Checklist Form](https://www.cfpc.ca/CFPC/media/Resources/Periodic-Health-Examination/PreventiveCareChecklistMaleEnglish2019.pdf))


#### BMI
- Computed using height & weight

#### LMP & EDD
- LMP is determined by searching through notes for 'LMP: MM/DD/YYYY' or 'LMP of MM/DD/YYYY'
- EDD is determined by 1st day of LMP + 40 weeks (Naegele's Rule). Assumes 28 day cycle. 

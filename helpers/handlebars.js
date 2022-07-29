module.exports = {
    selectedSkills: (selected = [], options) =>{
        const skills = ['HTML5','CSS3', 'CSSGrid', 'Flexbox', 'Javascript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'Typescript', 'PHP', 'Laravel', 'Sympfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Moongose', 'SQL', 'MVC', 'SASS', 'WordPress']

        let html = ``
        skills.forEach(skill =>{
            html += `
                <li>${skill}</li>
            `
        })

        return options.fn().html = html;
    }
}
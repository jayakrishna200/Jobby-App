import './index.css'

const SkillItem = props => {
  const {skillItem} = props
  const {name, imageUrl} = skillItem

  return (
    <li className="skill-item">
      <img src={imageUrl} alt={name} className="skill-img" />
      <p className="skill-name">{name} </p>
    </li>
  )
}

export default SkillItem

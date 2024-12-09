import React from 'react'

function Rating(props) {
    const{rating,numReviews}=props;
  return (
    <div className='rating'>
   <span>
  <i
    className={
      rating >= 1
        ? 'fas fa-star  text-yellow-500'
        : rating >= 0.5
        ? 'fas fa-star-half-alt  text-yellow-500'
        : 'far fa-star  text-yellow-500'
    }
  ></i>
</span>
<span>
  <i
    className={
      rating >= 2
        ? 'fas fa-star  text-yellow-500'
        : rating >= 1.5
        ? 'fas fa-star-half-alt  text-yellow-500'
        : 'far fa-star  text-yellow-500'
    }
  ></i>
</span>
<span>
  <i
    className={
      rating >= 3
        ? 'fas fa-star  text-yellow-500'
        : rating >= 2.5
        ? 'fas fa-star-half-alt  text-yellow-500'
        : 'far fa-star  text-yellow-500'
    }
  ></i>
</span>
<span>
  <i
    className={
      rating >= 4
        ? 'fas fa-star text-yellow-500'
        : rating >= 3.5
        ? 'fas fa-star-half-alt text-yellow-500'
        : 'far fa-star text-yellow-500'
    }
  ></i>
</span>
<span>
  <i
  className={
    rating >= 5
      ? 'fas fa-star text-yellow-500'
      : rating >= 4.5
      ? 'fas fa-star-half-alt text-yellow-500'
      : 'far fa-star text-yellow-500'
  }
  
  ></i>
</span>
<span className='text-yellow-500'>{numReviews} Reviews</span>


      
    </div>
  )
}

export default Rating

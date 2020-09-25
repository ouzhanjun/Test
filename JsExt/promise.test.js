
  
              const p1 = 'p1-ok';
              const p2 = jsDom.Promise.resolve('p2-ok');
              const p3 = new jsDom.Promise((resolve) => setTimeout(resolve, 3000, 'p3-ok'));
              const p4 = jsDom.Promise.reject('p4-err');
              jsDom.Promise.all([p1, p2, p3])
                  .then((resolves) => {
                    resolves.forEach(resolve => {
                        console.log(resolve); //p1-ok   p2-ok  p3-ok
                    });
                  })
                  .catch(() => {
                    console.log('err');
                  });
              
                  jsDom.Promise.all([p1, p2, p3, p4])
                  .then(() => {
                    console.log('ok');
                  })
                  .catch((err) => {
                     console.log(err); //p4-err
                  })